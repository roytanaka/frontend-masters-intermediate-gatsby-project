exports.createPages = ({actions}) =>{
  const {createPage} = actions;

  createPage({
    path: '/custom',
    component: require.resolve('./src/templates/Custom.jsx'),
    context:{
      title: 'A Custom Page!',
      meta:{
        description: 'A custom page with context.'
      }
    },
  })
}