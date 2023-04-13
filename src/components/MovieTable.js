import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Form from 'react-bootstrap/Form';
import { SortAlphaDown, SortAlphaUp } from "react-bootstrap-icons";
import Icon from "./Icon";
import ContentLoader from 'react-content-loader'

function MovieTable(props) {
    const [sort,setSort] = useState('asc');
    const [order,setOrder] = useState('title');
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [limit, setLimit] = useState(10);
    const [total,setTotal] = useState();


    const query = async () =>{
        setLoading(true)
        try {
            let url = `/films?${limit?'limit='+limit:''}${page?'&page='+page:''}${order?'&order='+order:''}${sort?'&sort='+sort:''}`
            const response = await fetch(url);
            const data = await response.json();
            setMovies(data.data);
            setDone(true);
            setTotal(data.count)
        } catch (error) {
            console.log('Error fetching films: ', error);
        }
        setLoading(false);
    }

    React.useEffect(() => {
        if(!loading && !done){
            console.log("query",movies,loading,done)
            query()
        }
    }, [loading, done]);

    const handlePageChange = (page) => {
        setPage(page);
        setDone(false);
    }

    const handleLimitChange = (event) => {
        console.log(event.target.value,event)
        setLimit(parseInt(event.target.value));
        setDone(false);
        setPage(1);
    }
    const clearThActive = () => {
        let ths = document.querySelectorAll('th');
        ths.forEach((th) => {
            th.classList.remove('active');
        });
    }
    const onSort = (e,field) => {
        
        if(order===field){
            setSort(sort==='asc'?'desc':'asc');
        }else{
            clearThActive();
            setOrder(field);
            setSort('asc');
        }
        e.target.closest('th').classList.add('active');
        setDone(false);
    }

    // TODO: implémenter la logique de pagination et de tri
    let options = []

    let count=10
    while(count<total){
        options.push(<option value={count}>{count}</option>)
        count*=2
    }
    options.push(<option value={total}>All</option>)

    let debbuger = true
    let loadingContent = new Array(limit).fill(<tr><td colSpan="5"><ContentLoader viewBox="0 0 985 50"><rect x="25" y="12" rx="3" ry="3" width="935" height="25" /></ContentLoader></td></tr>)
    return (
        <div class="limiter">
        <div class="container-table100 flex-col">
        <h1>Sakila Pagination</h1>
      <br/>
                    <div class="table100">
              <table>
        <thead>
          <tr class="table100-head">
            <th class="column1">Title {sort?<Icon onClick={(e) => onSort(e,"title")} sort={sort} type={"title"} order={order} />:<></>}</th>
            <th class="column2" >Genre {sort?<Icon  onClick={(e) => onSort(e,"genre")} sort={sort} type={"genre"} order={order} />:<></>}</th>
            <th class="column3" >Rentals {sort?<Icon  onClick={(e) => onSort(e,"rentals")} sort={sort} type={"rentals"} order={order} />:<></>}</th>
            <th class="column4" >Price {sort?<Icon  onClick={(e) => onSort(e,"price")} sort={sort} type={"price"} order={order} />:<></>}</th>
            <th class="column5" >Ranking {sort?<Icon  onClick={(e) => onSort(e,"ranking")} sort={sort} type={"ranking"} order={order} />:<></>}</th>
          </tr>
        </thead>
        <tbody>
            {!loading && done ? movies ? movies.map((movie) => {
                return (
                    <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.rentals}</td>
                        <td>{movie.price}</td>
                        <td>{movie.ranking}</td>
                    </tr>
                );
            })
            :
            <></>
            : loading ? loadingContent : <></>
        }
        </tbody>
      </table>
      <br/>
      <div className="row flex-nowrap">
            <div className="col-1">
            <Form.Select aria-label="Default select example" size="sm" onChange={(e)=>handleLimitChange(e)}>
                {options}
    </Form.Select>
            </div>
            <div className="col-2">
           {total ? <p>{total} films</p> : <></>}
            </div>
            <div className="col-6">
            <PaginationControl
    page={page}
    between={4}
    total={total}
    limit={limit}
    changePage={(page) => {
        handlePageChange(page); 
    }}
    ellipsis={1}
  />
            </div>
            <div className="col-3"></div>
      </div>
      

      </div>
        </div>
        </div>
    
    );
}
export default MovieTable;