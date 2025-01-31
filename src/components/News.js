import React, { Component } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: 'General'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props){
    super(props); 
    this.state={
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json()
    this.props.setProgress(70);
    // console.log(parsedData);
    this.setState({
      articles: parsedData.articles, 
      totalResults: parsedData.totalResults,
      loading: false
    })
    this.props.setProgress(100);
  }

  async componentDidMount(){
    this.updateNews();
  }

  handlePrevClick = async() => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=83b791de8db24626978818fc28933d8b&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true})
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // // console.log(parsedData);
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading: false
    // })

    this.setState({page: this.state.page - 1})
    this.updateNews();

  }

  handleNextClick = async() => {
    // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){

    //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=83b791de8db24626978818fc28933d8b&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //   this.setState({loading: true})
    //   let data = await fetch(url);
    //   let parsedData = await data.json()
    //   // console.log(parsedData);
    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles,
    //     loading: false
    //   })
    // }

    this.setState({page: this.state.page + 1})
    this.updateNews();

    } 
    
    fetchMoreData= async()=>{
      this.setState({page: this.state.page + 1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`; 
        let data = await fetch(url);
        let parsedData = await data.json()
        // console.log(parsedData);
        this.setState({
          articles: this.state.articles.concat(parsedData.articles), 
          totalResults: parsedData.totalResults
        })
    }

  render() {
    return (
      <> 
       
        <h2 className=" mb-1 text-center mt-3">NewsMonkey - Top  {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>

        {/* <hr className="m-auto " style={{width: "350px", color: "red"}}/> */}
        {this.state.loading && <Spinner/>}

       <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >

          <div className="container">

            <div className="row my-3">
              {this.state.articles.map((element)=>{ 
                
                return <div className="col-md-4" key={element.url}>
                  <NewsItems title={element.title?element.title.slice(0, 28):""} description={element.description?element.description.slice(0, 88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
                })}
            </div>


          </div>
        </InfiniteScroll>
         
          {/* <div className="container d-flex justify-content-between">
            <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
          </div> */}

       
      </>
    );
  }
}

export default News;