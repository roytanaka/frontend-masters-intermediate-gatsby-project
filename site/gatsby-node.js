const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode, createTypes } = actions;

  createTypes(`
    type Author implements Node {
      books: [Book!]! @link(from: "slug" by: "author.slug")
    }
    type Book implements Node {
      author: Author! @link(from: "author" by: "slug")
    }
  `);
  authors.forEach((author) => {
    createNode({
      ...author,
      id: createNodeId(`author-${author.slug}`),
      parent: null,
      children: [],
      internal: {
        type: 'Author',
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author),
      },
    });
  });
  books.forEach((book) => {
    createNode({
      ...book,
      id: createNodeId(`book-${book.isbn}`),
      parent: null,
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });
};

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: '/custom',
    component: require.resolve('./src/templates/Custom.jsx'),
    context: {
      title: 'A Custom Page!',
      meta: {
        description: 'A custom page with context.',
      },
    },
  });
};

exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  store,
  reporter,
  createResolvers,
}) => {
  const { createNode } = actions;
  const resolver = {
    Book: {
      buyLink: {
        type: 'String',
        resolve: (source) =>
          `https://www.powels.com/serchresults?keyword=${source.isbn}`,
      },
      cover: {
        type: 'File',
        resolve: async (source) => {
          const res = await fetch(
            `https://openlibrary.org/isbn/${source.isbn}.json`,
          );
          if (!res.ok) {
            reporter.warn(
              `Error loading details about ${source.name} - got ${res.status} ${res.statusText}`,
            );
          }
          const { covers } = await res.json();
          if (covers.length) {
            return createRemoteFileNode({
              url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            });
          }
        },
      },
    },
  };
  createResolvers(resolver);
};
