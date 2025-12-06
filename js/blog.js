const blogPosts = [
  {
    title: "Landmine Button - Completed",
    date: "December 5, 2025",
    content: 
    `
    A little widget has been added! Spam it a bit, give it some love.
    <br><br>
    A little game which the Perlica Discord bot runs on the EF Discord, with a 0.8% chance of timing out a chatter.
    0.8% being the same chance as pulling a 6* operator! I plan to match the explosion colour and rates with the 
    operator gacha chances in the future.
    `,
  },
  {
    title: "Pull Simulation - Completed",
    date: "December 3, 2025",
    content: 
    `
    A new tool to view simulate pulls has been added! Check it out in the tools section.
    <br><br>
    The tool was made because players were trying to compare the gacha rates of games on the EF Discord (you should join 
    - shoutout to @Provence).
    `,
  },
  {
    title: "Initial Release",
    date: "December 3, 2025",
    content: 
    `
    The initial release of Endfield Resources is now live! Stay tuned for more updates and features.
    <br><br>
    I am a software graduate who ignored learning web development during their studies. I want to use this to help
    encourage me to learn (as you can tell with the quality of this site). I am starting with base HTML, then moving to 
    React, especially when I start to require animations, modules like interactive maps and other tools. 
    <br><br>
    Thank you so much for visiting, may your factory continue to grow!
    `,
  },
];

function loadBlogPosts() {
  const notes = document.getElementById("notes");

  blogPosts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("blog-post");

    postDiv.innerHTML = 
    `
      <h3>${post.title}</h3>
      <p><em>${post.date}</em></p>
      <p>${post.content}</p>
    `;

    notes.appendChild(postDiv);
  });
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);