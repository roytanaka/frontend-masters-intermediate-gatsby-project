import React from 'react'

const CustomPage = ({pageContext}) => {
  return (
    <div>
      <h1>{pageContext.title}</h1>
      <pre>{JSON.stringify(pageContext, null, 2)}</pre>
    </div>
  )
}

export default CustomPage
