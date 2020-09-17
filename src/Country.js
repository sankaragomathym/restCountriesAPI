import React from 'react';

class Country extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            country: [],
            borders: []
        }

        this.fetchFromAPI = this.fetchFromAPI.bind(this);
        this.fetchBorders = this.fetchBorders.bind(this);
    }

    componentDidMount() {
        let loc = window.location.href;
        let ctry = loc.substr(loc.lastIndexOf("/")+1);
        this.fetchFromAPI("https://restcountries.eu/rest/v2/name/" + ctry + "?fullText=true");
    }

    componentWillReceiveProps(nextProps) {
        const id = this.props;
        if (nextProps.id !== id) {
            this.setState({
                isLoaded: false
            }, 
            () => this.fetchFromAPI("https://restcountries.eu/rest/v2/name/" + this.props.location.state.id + "?fullText=true"));
        }
    }

    fetchFromAPI(query) {
        fetch(query)
        .then((response) => response.json())
        .then(
            (data) => {

                if(data[0].borders.length) {
                    let codeStr = "https://restcountries.eu/rest/v2/alpha?codes=";
                    data[0].borders.forEach(el => {
                        codeStr = codeStr + el + ";";
                    });

                    this.fetchBorders(codeStr);

                    this.setState({
                        country: data[0]
                    });
                }
                else {
                    this.setState({
                        isLoaded: true,
                        country: data[0]
                    });
                }
            },

            (error) => { 
                this.setState({
                    error
                });
            }
        );
    }

    fetchBorders(codeQuery) {
        fetch(codeQuery)
        .then((response) => response.json())
        .then(
            (data) => {
                this.setState({
                    isLoaded: true,
                    borders: data.map(i => (i.name))
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

    render() {

        const { error, isLoaded, country } = this.state;

        if(error) {
            return ( <div>Error loading Countries. { error.message }</div>);
        }

        else if(!isLoaded) {
            return ( <div>Loading...</div> );
        }

        else {
            
            return(
                <div className="details-cont">
                    <button id="backButton" title="Back to home" onClick={() => { this.props.history.push('/'); }}>
                        <span className="back-icon"><i className="fas fa-long-arrow-alt-left"></i></span>
                        <span>Back</span>
                    </button>

                    <div className="container d-flex">
                        <div className="flag-cont">
                            <img src={ country.flag } alt="Flag" />
                        </div>

                        <div className="info-cont">
                            <h1>{ country.name }</h1>

                            <div className="details d-flex">
                                <div className="details-1">
                                    <div><span className="info-label">Native Name: </span> <span>{ country.nativeName }</span></div>
                                    <div><span className="info-label">Population: </span> <span>{ country.population.toLocaleString() }</span></div>
                                    <div><span className="info-label">Region: </span> <span>{ country.region }</span></div>
                                    <div><span className="info-label">Sub Region: </span> <span>{ country.subregion }</span></div>
                                    <div><span className="info-label">Capital: </span> <span>{ country.capital }</span></div>
                                </div>

                                <div className="details-2">
                                    <div><span className="info-label">Top Level Domain: </span> <span>{ country.topLevelDomain.join(", ") }</span></div>
                                    <div><span className="info-label">Currencies: </span> <span>{ country.currencies.map(c => (c.name)).join(", ") }</span></div>
                                    <div><span className="info-label">Languages: </span> <span>{ country.languages.map(l => (l.name)).join(", ") }</span></div>
                                </div>
                            </div>

                            <div className="border-countries">
                                <span className="border-text info-label">Border Countries: </span>
                                
                                {!this.state.borders.length && <span>None</span>}

                                <div className="bc-cont">
                                    {this.state.borders.map(bc => (
                                        <button key={bc} title={bc}
                                            onClick={() => { this.props.history.push({pathname: '/country/' + bc, state: {id: bc} }); }}>
                                            {bc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Country;