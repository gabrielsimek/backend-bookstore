<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Begin Jekyll SEO tag v2.7.1 -->
<title>Local Bookstore | backend-bookstore</title>
<meta name="generator" content="Jekyll v3.9.0" />
<meta property="og:title" content="Local Bookstore" />
<meta property="og:locale" content="en_US" />
<link rel="canonical" href="https://alchemycodelab.github.io/backend-bookstore/" />
<meta property="og:url" content="https://alchemycodelab.github.io/backend-bookstore/" />
<meta property="og:site_name" content="backend-bookstore" />
<meta name="twitter:card" content="summary" />
<meta property="twitter:title" content="Local Bookstore" />
<script type="application/ld+json">
{"url":"https://alchemycodelab.github.io/backend-bookstore/","@type":"WebSite","name":"backend-bookstore","headline":"Local Bookstore","@context":"https://schema.org"}</script>
<!-- End Jekyll SEO tag -->

    <link rel="stylesheet" href="/backend-bookstore/assets/css/style.css?v=6cf86aa57e28dda542e625e353c80eed45a1bd7d">
    <!-- start custom head snippets, customize with your own _includes/head-custom.html file -->

<!-- Setup Google Analytics -->



<!-- You can set your favicon here -->
<!-- link rel="shortcut icon" type="image/x-icon" href="/backend-bookstore/favicon.ico" -->

<!-- end custom head snippets -->

  </head>
  <body>
    <div class="container-lg px-3 my-5 markdown-body">
      
      <h1><a href="https://alchemycodelab.github.io/backend-bookstore/">backend-bookstore</a></h1>
      

      <h1 id="local-bookstore">Local Bookstore</h1>

<h3 id="learning-objectives">Learning Objectives</h3>

<ul>
  <li>Write a SELECT query that returns all rows from a SQL table</li>
  <li>Write a UPDATE query that updates and returns particular rows in a SQL table</li>
  <li>Write a INSERT query that creates and returns a row in a SQL table</li>
  <li>Write a DELETE query that deletes a particular row in a SQL table</li>
  <li>Write a CREATE query to create a SQL table with opinionated data types</li>
  <li>Write a SELECT query that returns a sorted list of rows using ORDER BY</li>
  <li>Write a SELECT query that returns a list of rows using GROUP BY</li>
  <li>Write a SELECT query that returns the AVG of a set of rows for a numeric field</li>
  <li>Create a table that uses field types: INT, BIGINT, BOOLEAN, TEXT, VARCHAR, DATE, TIME, TIMESTAMPZ, JSON</li>
  <li>Create tables that utilize primary keys, foreign keys, and indexes</li>
  <li>Create a table that has constraints using NOT NULL, UNIQUE, CHECK</li>
  <li>Write a JOIN query to return relational data in two SQL tables</li>
  <li>Model data that requires one-to-one, one-to-many, &amp; many-to-many table relationships</li>
  <li>Describe what a junction table is and when it’s used</li>
  <li>Write a SELECT query that JOINs two SQL tables via a junction table</li>
</ul>

<h3 id="description">Description</h3>

<p>You’ve been hired by Bilbo’s Books, a local bookstore that’s in dire need of a better website. You’ve been assigned the task of building the store’s backend, which includes a database &amp; API. The database will contain books, book reviews, reviewers, publishers, and authors.</p>

<h3 id="approach">Approach</h3>

<p>Start by using the <a href="https://github.com/alchemycodelab/backend-template">backend-template</a>.</p>

<ol>
  <li>Work vertically. That means build the tests, route and model for one entity/resource at a time. Horizontal would be building all the models first. Do <strong>not</strong> do that — go vertical!</li>
  <li>Start with the entities/resources that don’t depend on other resources: <code class="language-plaintext highlighter-rouge">Publisher</code>, <code class="language-plaintext highlighter-rouge">Author</code>, and <code class="language-plaintext highlighter-rouge">Reviewer</code></li>
</ol>

<h3 id="models-entitiesresources">Models (Entities/Resources)</h3>

<ul>
  <li>Publisher</li>
  <li>Author</li>
  <li>Book</li>
  <li>Reviewer</li>
  <li>Review</li>
</ul>

<h2 id="database-schema-overview">Database Schema Overview</h2>

<blockquote>
  <p>The term “schema” refers to the organization of data as a blueprint of how the database is constructed (divided into database tables in the case of relational databases).
<sub><a href="https://en.wikipedia.org/wiki/Database_schema">Source</a></sub></p>
</blockquote>

<p>A schema is what defines the structure of a database and its tables. For this database, the schema has been defined below, using the following syntax:</p>

<ul>
  <li><code class="language-plaintext highlighter-rouge">&lt;...&gt;</code> is a placeholder for actual data.</li>
  <li><code class="language-plaintext highlighter-rouge">S</code> = string, <code class="language-plaintext highlighter-rouge">D</code> = date, <code class="language-plaintext highlighter-rouge">N</code> = number, <code class="language-plaintext highlighter-rouge">I</code> = BIGINT</li>
  <li>Properties marked with <code class="language-plaintext highlighter-rouge">R</code> are required.</li>
  <li><code class="language-plaintext highlighter-rouge">id</code> property omitted for clarity.</li>
</ul>

<h3 id="publisher">Publisher</h3>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
  name: &lt;name-of-publisher RS&gt;,
  city: &lt;city S&gt;
  state: &lt;state S&gt;
  country: &lt;country S&gt;
}
</code></pre></div></div>

<h3 id="author-many-to-many-with-book">Author (Many-to-Many with Book)</h3>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
  name: &lt;name RS&gt;,
  dob: &lt;date-of-birth D&gt;,
  pob: &lt;place-of-birth S&gt;
}
</code></pre></div></div>

<h3 id="book-many-to-many-with-author">Book (Many-to-Many with Author)</h3>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
  title: &lt;title of book RS&gt;,
  publisher: &lt;publisher id RI&gt;,
  released: &lt;4-digit year RN&gt;
}
</code></pre></div></div>

<h3 id="reviewer">Reviewer</h3>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
  name: &lt;string RS&gt;,
  company: &lt;company or website name RS&gt;
}
</code></pre></div></div>

<h3 id="review">Review</h3>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
  rating: &lt;rating number 1-5 RN&gt;,
  reviewer: &lt;review id RI&gt;
  review: &lt;review-text, max-length 140 chars RS&gt;,
  book: &lt;book-id RI&gt;
}
</code></pre></div></div>

<h2 id="routes">Routes</h2>

<p>Pick the set of routes that fit with your vertical slice.</p>

<h4 id="get">GET</h4>

<p>While the schemas should look like the data definitions above, these are descriptions of the data that should be returned from the various <code class="language-plaintext highlighter-rouge">GET</code> methods.</p>

<h5 id="get-publishers"><code class="language-plaintext highlighter-rouge">GET /publishers</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>[{ id, name }]
</code></pre></div></div>

<h5 id="get-publishersid"><code class="language-plaintext highlighter-rouge">GET /publishers/:id</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{ id, name, city, state, country, books: [{ id, title }] }
</code></pre></div></div>

<h5 id="get-books"><code class="language-plaintext highlighter-rouge">GET /books</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>[{
    id, title, released,
    publisher: { id, name }
}]
</code></pre></div></div>

<h5 id="get-booksid"><code class="language-plaintext highlighter-rouge">GET /books/:id</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
    title,
    released,
    publisher: { id, name },
    authors: [{ id, name }], // author id and name
    reviews: [{
        id,
        rating,
        review,
        reviewer: { id, name }
    ]
}
</code></pre></div></div>

<h5 id="get-authors"><code class="language-plaintext highlighter-rouge">GET /authors</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>[{ id, name }]
</code></pre></div></div>

<h5 id="get-authorsid"><code class="language-plaintext highlighter-rouge">GET /authors/:id</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
    name,
    dob,
    pob,
    books: [{
      id,
      title,
      released
    }]
}
</code></pre></div></div>

<h5 id="get-reviewers"><code class="language-plaintext highlighter-rouge">GET /reviewers</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>[{
  id,
  name,
  company
}]
</code></pre></div></div>

<h5 id="get-reviewersid"><code class="language-plaintext highlighter-rouge">GET /reviewers/:id</code></h5>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
    id,
    name,
    company,
    reviews: [{
        id,
        rating,
        review,
        book: { id, title }
    }]
}
</code></pre></div></div>

<h5 id="get-reviews"><code class="language-plaintext highlighter-rouge">GET /reviews</code></h5>

<p><strong>limit to 100 highest rated</strong></p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>[{
    id,
    rating,
    review,
    book: { id, title }
}]
</code></pre></div></div>

<h4 id="postput">POST/PUT</h4>

<ul>
  <li>POST: Publishers, Books, Authors, Reviewers, and Reviews can be added.</li>
  <li>PUT: Only Reviewers can be updated.</li>
</ul>

<h4 id="delete">DELETE</h4>

<p>Reviews and Reviewers <strong>However</strong>:</p>
<ul>
  <li>Reviewers cannot be deleted if there are reviews</li>
</ul>

<h3 id="acceptance-criteria">Acceptance Criteria</h3>

<ul>
  <li>User can get a list of Publishers</li>
  <li>User can get a list of Books</li>
  <li>User can get a list of Authors</li>
  <li>User can get a list of Reviewers</li>
  <li>User can get a list of Reviews (limited to the top 100 highest rated)</li>
  <li>User can get a single Publisher</li>
  <li>User can get a single Book</li>
  <li>User can get a single Author</li>
  <li>User can get a single Reviewer</li>
  <li>User can add a Publisher, Book, Author, Reviewer, and Review</li>
  <li>User can update a Reviewer</li>
  <li>User can delete a Reviewer <strong>if they don’t have any reviews</strong></li>
  <li>End-to-end (E2E) tests exist for all the supported routes</li>
  <li>API is deployed to Heroku</li>
</ul>

<h3 id="rubric">Rubric</h3>

<table>
  <thead>
    <tr>
      <th>Task</th>
      <th>Points</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Models</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Relationships</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Routes</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Tests</td>
      <td>3</td>
    </tr>
    <tr>
      <td>Project Organization</td>
      <td>2</td>
    </tr>
  </tbody>
</table>


      
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js" integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg=" crossorigin="anonymous"></script>
    <script>anchors.add();</script>
  </body>
</html>
