
const blogSection = document.querySelector('.blogs-section');

db.collection("blogs").get().then((blogs) => {
    blogs.forEach(blog => {
        if(blog.id != decodeURI(location.pathname.split("/").pop())){
            createBlog(blog);
        }
    })
})

const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card"> 
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
    </div>
    `;
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let query = document.getElementById('searchInput').value.trim().toLowerCase();

    if (query) {
        document.getElementById('clearSearchBtn').style.display = 'inline'; 
        db.collection("blogs").get().then((blogs) => {
            blogSection.innerHTML = ''; 
            let found = false;
            blogs.forEach(blog => {
                let data = blog.data();
                if (data.title.toLowerCase().includes(query) || data.article.toLowerCase().includes(query)) {
                    createBlog(blog);
                    found = true;
                }
            });
            if (!found) {
                blogSection.innerHTML = `<p>No blogs found matching "${query}".</p>`;
            }
        }).catch((error) => {
            console.error("Error searching blogs: ", error);
        });
    } else {
        alert("Please enter a search term.");
    }
});

document.getElementById('clearSearchBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = ''; 
    document.getElementById('clearSearchBtn').style.display = 'none';
    loadAllBlogs();
});

function loadAllBlogs() {
    db.collection("blogs").get().then((blogs) => {
        blogSection.innerHTML = ''; 
        blogs.forEach(blog => {
            createBlog(blog); 
        });
    }).catch((error) => {
        console.error("Error loading blogs: ", error);
    });
}


document.addEventListener("DOMContentLoaded", loadAllBlogs);
