import React, { useState, useEffect } from 'react'
import {Table, Spinner, Button} from 'react-bootstrap'

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(19);

    const getTodos = () => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(json => {
                const start = (page-1)*10+1;
                const end = page*10
                const newJson = json.filter(j=>j.id>=start && j.id<=end);
                console.log(newJson);
                setTodos(newJson);
                setLoading(false);
            })
    }

    useEffect(() => {
        getTodos();
    }, [page]);

    if(loading)
        return (
            <div className='text-center my-5'>
                <Spinner animation="border" variant="warning" role="status" />
            </div>
        )

    return (
        <div className='m-5'>
            <h1 className='text-center my-5'>To Do</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo =>
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                        </tr> 
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-3'>{page}/20</span>
                <Button onClick={()=>setPage(page+1)} disabled={page===20}>다음</Button>
            </div>
        </div>
    )
}

export default Todos