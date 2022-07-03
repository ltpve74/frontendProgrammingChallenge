import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'

import {FormHelperText, MenuItem, Pagination, Select, TextField} from "@mui/material";
import './App.css';

class FilteredResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      artworks: this.props.artworks,
      pageLimit: 20,
      currentPage: 1,
      pageCount: 1
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageLimit = this.handlePageLimit.bind(this)
    this.search = this.search.bind(this)
  }

  handlePageChange(e, newPage) {
    console.log("handlePageChange " + newPage)
    this.setState({
        currentPage: newPage
    },
      this.search
    )
  }

  handlePageLimit(e){
    console.log(e.target.value)
    this.setState({
      currentPage: 1,
      pageLimit: e.target.value
    },
      this.search
    )
  }

  handleSearch(e) {
    this.setState({
      searchQuery: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.search()
  }

  search = () => {
    console.log("search, limit="+ this.state.pageLimit + " page=" + this.state.currentPage)
    const jsonQuery =
      {
        q: this.state.searchQuery,
        page: this.state.currentPage,
        limit: this.state.pageLimit,
        fields: ["id","title","image_id","artist_display"],
        query: {
          term: {
            "is_public_domain": true
          }
        }
      }

    const stringifiedQuery = JSON.stringify(jsonQuery)
    const q = "https://api.artic.edu/api/v1/artworks/search?params="+stringifiedQuery

    try {
      fetch(q)
        .then(res => res.json())
        .then((result) => {
          this.setState({
            artworks: result.data,
            pageCount: result.pagination.total_pages
          })
        })
    }
    catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText = {this.state.searchQuery}

          currentPage = {this.state.currentPage}
          handleSearch = {this.handleSearch}
          handleSubmit = {this.handleSubmit}

        />
        <ResultsTable
          artworks={this.state.artworks}
          pageCount = {this.state.pageCount}
          pageLimit = {this.state.pageLimit}
          handlePageChange = {this.handlePageChange}
          handlePageLimit = {this.handlePageLimit}
        />
      </div>
    )
  }
}

class SearchBar extends React.Component {
  render(){
    const searchQuery = this.props.searchQuery
    return (

      <>
        <TextField variant={"outlined"} label={"Search Artic"} size={"small"} onChange={this.props.handleSearch}>{searchQuery}</TextField>
        <Button variant={"contained"} onClick={this.props.handleSubmit}>Submit</Button>


      </>
    )
  }
}

class ResultsTable extends React.Component {
  render(){
    const rows = []
    if (this.props.artworks) {
      this.props.artworks.forEach((result) => {
          rows.push(
            <ResultRow
              result={result}
              key = {result.id}
            />
          )
        }
      )
    }

    if(rows.length > 0){
      console.log("pageCount "+ this.props.pageCount);
      return (

        <>
          <Pagination count={this.props.pageCount} showFirstButton showLastButton shape={"rounded"} variant={"outlined"} size={"medium"} color={"primary"} onChange={this.props.handlePageChange} />
          <FormHelperText>results per page</FormHelperText>
          <Select value={this.props.pageLimit} size={"small"} onChange={this.props.handlePageLimit} title={"results per page"}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
          <TableContainer component={Paper}>
            <Table sx={{maxWidth: 650, padding: 10}} aria-label="results table">
              <TableHead>
                <TableRow>
                  <TableCell align={"left"}>Image</TableCell>
                  <TableCell align={"left"}>Title</TableCell>
                  <TableCell align={"left"}>Artist_Display</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {rows}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    }
    return (
      <div />
    )

  }
}

class ResultRow extends React.Component {
  render() {
    const result = this.props.result
    return (
      <TableRow
        key={result.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
        <TableCell align={"left"}><img src={"https://www.artic.edu/iiif/2/" + result.image_id + "/full/100,/0/default.jpg"} alt={result.title}/></TableCell>
        <TableCell align={"left"}>{result.title}</TableCell>
        <TableCell align={"left"}>{result.artist_display}</TableCell>
      </TableRow>

    )
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FilteredResultsTable   />
      </header>
    </div>
  );
}


export default App;
