
var ui = new firebaseui.auth.AuthUI(auth);
const blogSection = document.querySelector('.blogs-section');  

const setupLoginButton = () => {
    console.log('Setting up Firebase UI');
    ui.start('#loginUI', {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectURL) {
                console.log('Sign-in successful', authResult);
                return false;
            }
        },
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    });
};

const userWrittenBlogs = () => {
    const user = auth.currentUser;
    if (user) {
        const emailPrefix = user.email.split('@')[0];
        db.collection("blogs").where("author", "==", emailPrefix)
        .get()
        .then((blogs) => {
            if (blogs.empty) {
                console.log('No blogs found');
            } else {
                blogs.forEach((blog) => {
                    createBlog(blog);
                });
            }
        }).catch((error) => {
            console.error("Error getting blogs: ", error);
        });
    }
}

const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
        <div class="blog-card"> 
            <img src="${data.bannerImage}" class="blog-image" alt="">
            <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
            <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
            <a href="/${blog.id}" class="btn dark">read</a>
        </div>`;
}

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in');
        document.querySelector(".login").style.display = "none";
        document.querySelector(".main-content").style.display = "block";
        userWrittenBlogs();
 
        let ul = document.querySelector('.links-container');

        if (!ul.querySelector('a[href="/dashboard"]')) {
            ul.innerHTML += `
                <li class="link-item"><a href="/dashboard" class="link">Dashboard</a></li>
            `;
        }

        if (!ul.querySelector('a[onclick="logoutUser()"]')) {
            ul.innerHTML += `
                <li class="link-item"><a href="#" onclick="logoutUser()" class="link">Logout</a></li>
            `;
        }

    } else {
        console.log('No user is signed in');
        document.querySelector(".login").style.display = "flex";
        document.querySelector(".main-content").style.display = "none";
        setupLoginButton();
    }
});

const logoutUser = () => {
    auth.signOut().then(() => {
        location.reload();
    }).catch(error => {
        console.error('Sign Out Error', error);
    });
};
