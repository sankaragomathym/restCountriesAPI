import React from 'react';
import { withRouter } from 'react-router-dom';


class Countries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            countries: []
        }

        this.fetchFromAPI = this.fetchFromAPI.bind(this);
        this.searchCountry = this.searchCountry.bind(this);
        this.filterByRegion = this.filterByRegion.bind(this);
        this.showMenuOptions = this.showMenuOptions.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    componentDidMount() {
        this.fetchFromAPI("https://restcountries.eu/rest/v2/all");
    }


    fetchFromAPI(query) {
        fetch(query)
        .then((response) => response.json())
        .then(
            (data) => {
                let cArr = [];
                if(Array.isArray(data)) {
                    cArr = data;
                }
                this.setState({
                    isLoaded: true,
                    countries: cArr
                });
            },

            (error) => { 
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }


    searchCountry(e) {
        let searchText = e.target.value;
        if(searchText === "") {
            this.fetchFromAPI("https://restcountries.eu/rest/v2/all");
        } 
        else {
            this.fetchFromAPI("https://restcountries.eu/rest/v2/name/" + searchText);
        }     
    }


    filterByRegion(region) {
        document.querySelector(".dropdown-option-cont").classList.add("hide");
        document.querySelector(".dropdown-cont .close-icon").classList.remove("hide");

        document.getElementById("filterText").textContent = region;
        this.fetchFromAPI("https://restcountries.eu/rest/v2/region/" + region);
    }


    showMenuOptions() {
        document.querySelector(".dropdown-option-cont").classList.toggle("hide");
    }


    removeFilter(e) {
        e.stopPropagation();
        document.querySelector(".dropdown-cont .close-icon").classList.add("hide");

        document.getElementById("filterText").textContent = "Filter by Region";
        this.fetchFromAPI("https://restcountries.eu/rest/v2/all");
    }


    render() {

        const { error, isLoaded, countries } = this.state;
        let regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

        if(error) {
            return ( <div>Error loading Countries. { error.message }</div>);
        }

        else if(!isLoaded) {
            return ( <div>Loading...</div> );
        }

        else {
            return(
                <div>
                    <div className="filters d-flex">
                        <div className="search-cont">
                            <span className="search-icon"><i className="fas fa-search"></i></span>
                            <input type="text" id="searchInput" title="Search for a country" placeholder="Search for a country..." onChange={this.searchCountry} />
                        </div>

                        <div className="dropdown-cont">
                            <div className="dropdown-menu d-flex" onClick={this.showMenuOptions}>
                                <div id="filterText">Filter by region</div>
                                <span className="close-icon hide" onClick={this.removeFilter}><i className="fas fa-times"></i></span>
                                <span className="menu-icon"><i className="fas fa-chevron-down"></i></span>
                            </div>
                            
                            <div className="dropdown-option-cont hide">
                                {regions.map(rg => (
                                    <div key={rg} className="dropdown-option" onClick={() => this.filterByRegion(rg) }>{rg}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    

                    <div className="country-list">
                        {!countries.length && <div className="no-result">No results found..</div>}
                        
                        {countries.map(country => (
                            <CountryCard key={country.name} Country={country} {...this.props}/>
                        ))}
                    </div>
                </div>
            );
        }
    }
};

class CountryCard extends React.Component {

    render() {

        const country = this.props.Country;

        return (
            <div data-country={country.name} className="country-card"
                onClick={() => { this.props.history.push({pathname: '/country/' + country.name, state: {id: country.name} }); }}> 

                <div className="flag">
                    <img src={ country.flag } alt="Flag" />
                </div>

                <div className="country-info">
                    <h3>{ country.name }</h3>
                    <div><span className="info-label">Population: </span> <span>{ country.population.toLocaleString() }</span></div>
                    <div><span className="info-label">Region: </span> <span>{ country.region }</span></div>
                    <div><span className="info-label">Capital: </span> <span>{ country.capital }</span></div>
                </div>

            </div>  
        );
    }
}

export default withRouter(Countries);