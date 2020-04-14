import React, { useState } from 'react'
import { graphql } from 'gatsby'
import useLocalStorage from '@illinois/react-use-local-storage'

import { renderAst } from '../markdown'
import { ChapterContext } from '../context'
import Layout from '../components/layout'
import { Pagination } from '../components/pagination'

import classes from '../styles/chapter.module.sass'

const Template = ({ data }) => {
    const { markdownRemark } = data
    const { frontmatter, htmlAst, parent, fields } = markdownRemark
    const { title, description, prev, next, id } = frontmatter
    const { lang } = fields
    const [activeExc, setActiveExc] = useState(null)
    const [completed, setCompleted] = useLocalStorage(`spacy-course-completed-${id}`, [])
    const html = renderAst(htmlAst)

    return (
        <ChapterContext.Provider value={{ lang, activeExc, setActiveExc, completed, setCompleted }}>
            <Layout lang={lang} title={title} description={description} pageName={parent.name}>
                {html}

                <Pagination className={classes.pagination} prev={prev} next={next} lang={lang} />
            </Layout>
        </ChapterContext.Provider>
    )
}

export default Template

export const pageQuery = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            htmlAst
            frontmatter {
                id
                title
                description
                next
                prev
            }
            fields {
                lang
            }
            parent {
                ... on File {
                    name
                }
            }
        }
    }
`
