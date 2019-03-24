import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import ImageGallery from 'react-image-gallery';
import { request } from 'graphql-request'

const dev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const endpoint = dev ? "http://localhost:4000" : "https://wizardly-bhabha-0f7549.netlify.com/.netlify/functions/index"

const listingsQ = /* GraphQL */ `
    query getListings($neighborhoodId: ID, $propertyTypeId: ID) {
        listings(neighborhoodId: $neighborhoodId, propertyTypeId: $propertyTypeId) {
            id
            priceFormatted
            neighborhood { name }
            propertyType { name }
            numberOfBedrooms
            numberOfBathrooms
            images
            address {
                display
            }
        }
    }
  `

class ListingGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = { neighborhoodId: '', propertyTypeId: '' };

        this.handleNeighborhoodChange = this.handleNeighborhoodChange.bind(this);
        this.handlePropertyTypeChange = this.handlePropertyTypeChange.bind(this);

    }

    handleNeighborhoodChange(event) {
        this.setState({ neighborhoodId: event.target.value });
    }

    handlePropertyTypeChange(event) {
        this.setState({ propertyTypeId: event.target.value });
    }


    render() {
        const { data } = this.props
        const { listings, neighborhoods, propertyTypes } = data.realestate

        const neighborhoodsOptions = neighborhoods.map(n => (<option key={n.id} value={n.id}>{n.name}</option>))

        const propertyTypesOptions = propertyTypes.map(n => (<option key={n.id} value={n.id}>{n.name}</option>))

        const handleSubmit = async (event) => {

            const variables = {
                neighborhoodId: this.state.neighborhoodId,
                propertyTypeId: this.state.propertyTypeId
            }

            console.log(variables);


            const data = await request(endpoint, listingsQ, variables)
            console.log(data);

            event.preventDefault();
        }

        return (
            <div>
                <form onSubmit={handleSubmit} style={{ marginBottom: '100px' }}>
                    <div className="select">
                        <select value={this.state.neighborhood} onChange={this.handleNeighborhoodChange}>
                            {neighborhoodsOptions}
                        </select>
                    </div>

                    <div className="select">
                        <select value={this.state.propertyType} onChange={this.handlePropertyTypeChange}>
                            {propertyTypesOptions}
                        </select>
                    </div>

                    <div className="field">
                        <button className="button is-link" type="submit">
                            Search
                  </button>
                    </div>
                </form>
                <div className="columns is-multiline">
                    {listings &&
                        listings.map((listing) => (
                            <div className="is-parent column is-6" key={listing.id}>
                                <ImageGallery showPlayButton={false} showThumbnails={false} showFullscreenButton={false} items={listing.images.map(image => ({ original: image }))} />
                                <article className="tile is-child box notification">
                                    <p>
                                        <Link
                                            className="title has-text-primary is-size-4"
                                            to={listing.id}
                                        >
                                            {listing.address.display}
                                        </Link>
                                        <span> &bull; </span>
                                        <span className="subtitle is-size-5 is-block">
                                            {listing.priceFormatted}
                                        </span>

                                        <span className="is-size-5 is-block">
                                            {listing.propertyType ? listing.propertyType.name : ''} in {listing.neighborhood.name}
                                        </span>
                                        <span className="is-size-5 is-block">
                                            numberOfBedrooms: {listing.numberOfBedrooms}
                                        </span>
                                        <span className="is-size-5 is-block">
                                            numberOfBathrooms: {listing.numberOfBathrooms}
                                        </span>
                                    </p>
                                </article>
                            </div>
                        ))}
                </div>
            </div >
        )
    }
}

ListingGrid.propTypes = {
    data: PropTypes.shape({
        realestate: PropTypes.shape({
            listings: PropTypes.array,
            propertyTypes: PropTypes.array,
            neighborhoods: PropTypes.array,
        }),
    }),
}

export default () => (
    <StaticQuery
        query={graphql`
      query ListingsQuery {
        realestate {
        neighborhoods {
            id
            name
        }
        propertyTypes {
            id
            name
        }
        listings {
            id
            priceFormatted
            neighborhood { name }
            propertyType { name }
            numberOfBedrooms
            numberOfBathrooms
            images
            address {
                display
            }
        }
        }
      }
    `}
        render={(data) => <ListingGrid data={data} />}
    />
)
