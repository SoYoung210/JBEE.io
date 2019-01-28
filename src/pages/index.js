import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { uniq } from 'lodash'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Category } from '../components/category'
import { ToTop } from '../components/to-top'
import HomeContainer from '../containers/home'

import { getElementPosition } from '../utils/dom'
import { SCROLL_Y, HOME_TITLE, CATEGORY_TYPE } from '../constants'

export default class BlogIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCategory: CATEGORY_TYPE.ALL,
    }
    this.selectCategory = this.selectCategory.bind(this)
  }

  componentDidMount() {
    this.categoryPosition = getElementPosition('#category')(SCROLL_Y)
  }

  selectCategory(e, item) {
    e.preventDefault()

    if (window.scrollY > this.categoryPosition) {
      window.scrollTo(0, this.categoryPosition)
    }

    this.setState(prevState => {
      return (
        prevState.currentCategory !== item && {
          currentCategory: item,
        }
      )
    })
  }

  render() {
    const { currentCategory } = this.state
    const { data } = this.props
    const { siteMetadata } = data.site
    const { countOfInitialPost } = siteMetadata.configs
    const posts = data.allMarkdownRemark.edges
    const category = uniq(posts.map(({ node }) => node.frontmatter.category))

    return (
      <React.Fragment>
        <Layout location={this.props.location} title={siteMetadata.title}>
          <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
          <Bio />
          <Category
            category={category}
            currentCategory={currentCategory}
            selectCategory={this.selectCategory}
          />
          <HomeContainer
            currentCategory={currentCategory}
            countOfInitialPost={countOfInitialPost}
            posts={posts}
          />
        </Layout>
        <ToTop onClick={() => window.scrollTo(0, 0)} />
      </React.Fragment>
    )
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
          }
        }
      }
    }
  }
`
