import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'

export const ListingsPageTemplate = ({
    listings
}) => {

    console.log(listings);

    const list = listings.map(listing => (<li key={listing.id}>{listing.address.display}</li>))

    return (
        <section>
            <ul>
                {list}
            </ul>
        </section>)
}

ListingsPageTemplate.propTypes = {
    listings: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string
    }))
}

const ListingsPage = ({ data }) => {
    console.log(data);

    // const { listings } = data.realestate;

    return (
        <Layout>
            {/* <ListingsPageTemplate
                listings={listings}
            /> */}
        </Layout>
    )
}

// IndexPage.propTypes = {
//     data: PropTypes.shape({
//         realestate: PropTypes.shape({
//             frontmatter: PropTypes.object,
//         }),
//     }),
// }

export default ListingsPage

// export const pageQuery = graphql`
//     query {
//     realestate {
//       listings {
//         id
//         priceFormatted
//         address {
//             display
//         }
//       }
//     }
//   }
// `
