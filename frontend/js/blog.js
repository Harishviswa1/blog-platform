
document.addEventListener("DOMContentLoaded", () => {
    
    let blogId = decodeURI(location.pathname.split("/").pop());

    if (blogId) {
        
        let docRef = db.collection("blogs").doc(blogId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                setupBlog(doc.data());
            } else {
                location.replace("/");
            }
        }).catch((error) => {
            console.error("Error fetching document: ", error);
            location.replace("/");
        });
    } else {
        console.error("Blog ID is undefined or invalid.");
        location.replace("/");
    }
});


const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');

    // Set the banner image
    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML+=`- - ${data.author}`;

    const article = document.querySelector('.article');
    addArticle(article, data.article);
}


const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
      
        if (item[0] === '#') {
            let hCount = 0;
            let i = 0;
            while (item[i] === '#') {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount).trim()}</${tag}>`;
        }
        
        else if (item.startsWith("![")) {
            let separator = item.indexOf("](");
            if (separator !== -1) {
                let alt = item.slice(2, separator);
                let src = item.slice(separator +     2, -1);
                ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
            }
        }
        else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let blogId = decodeURI(location.pathname.split("/").pop());

    if (blogId) {
        let docRef = db.collection("blogs").doc(blogId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                setupBlog(doc.data());
                loadComments(blogId);
            } else {
                location.replace("/");
            }
        }).catch((error) => {
            console.error("Error fetching document: ", error);
            location.replace("/");
        });

        // Handle comment form submission
        const commentForm = document.getElementById('comment-form');
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentInput = document.getElementById('comment-input');
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                const commentData = {
                    text: commentText,
                    author: "Anonymous", // You can replace this with user data if you have authentication
                    timestamp: new Date()
                };
                
                db.collection("blogs").doc(blogId).collection("comments").add(commentData)
                .then(() => {
                    commentInput.value = '';
                    loadComments(blogId); // Refresh comments
                })
                .catch(error => console.error("Error adding comment: ", error));
            }
        });
    } else {
        console.error("Blog ID is undefined or invalid.");
        location.replace("/");
    }
});

const loadComments = (blogId) => {
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = '';

    db.collection("blogs").doc(blogId).collection("comments").orderBy("timestamp", "asc").get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            const commentData = doc.data();
            commentsList.innerHTML += `
                <div class="comment">
                    <p class="author">${commentData.author}</p>
                    <p>${commentData.text}</p>
                    <small>${new Date(commentData.timestamp.seconds * 1000).toLocaleString()}</small>
                </div>
            `;
        });
    })
    .catch(error => console.error("Error loading comments: ", error));
};
