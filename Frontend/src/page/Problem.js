
import React, { useContext, useEffect, useState }  from 'react';
import queryString from 'query-string'
import ReactLoading from 'react-loading';

import {BACKEND_URL, PAGINATION} from '../util/config'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../util/UserContext';

function Problem() {

    const query = queryString.parse(useLocation().search) 
    const history = useHistory()

    const [problem, setProblem] = useState(null)
    const [page, setPage] = useState( Math.max(query.page || 1), 1 )
    const tag = query.tag
    const [title, setTitle] = useState(query.title)
    const author = query.author
    const admin = query.admin

    const [userFromContext, setUserFromContext] = useContext(UserContext)

    // console.log(page, tag, title, admin)
    // console.log(queryString.stringify(query))

    useEffect(() => {

        try{ //console.log('query', queryString.stringify(query))
            (async()=> {
                

                const query_object = {}
                if(page) query_object.page = page
                if(title) query_object.title = title
                if(admin) query_object.admin = admin
                if(tag) query_object.tag = tag
                if(author) query_object.author = author

                // console.log(page, tag, title, admin)
                //console.log(`${BACKEND_URL}/problem/search?${queryString.stringify(query_object)}`)

                const response = await fetch( `${BACKEND_URL}/problem/search?${queryString.stringify(query_object)}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  })
                const data = await response.json()
                //console.log(data)
                if(data.success === "yes") {
                    data.data.forEach(problem => {
                        problem.tag = problem.tag.map(item => {
                            return (<Link to={"/problem?tag="+item}  target="_blank" className="p-1 underline">{item}</Link>)
                        })
                    })
                    setProblem(data.data)
                } else {
                    history.push('/404')
                    // history.go(0)
                }

            })()
        }catch(err){
            //console.log(err)
            
        }


    }, [])


    const goto = () => {
        const query_object = {}
        if(page) query_object.page = page
        if(title) query_object.title = title
        if(admin) query_object.admin = admin
        if(tag) query_object.tag = tag
        history.push(`/problem?${queryString.stringify(query_object)}`)
        history.go(0)
    }

    // const gotoEdit = (problem_id) => {
    //     console.log(problem_id)
    // }

    const handleEnter = (event) => {
        if(event.key === 'Enter') goto()
    }

    const putStatusIcon = (problem_id) => {

        //console.log(userFromContext, userFromContext.solved_problem.length)

        for(let i = 0; i < userFromContext.solved_problem.length; i++){
            if(userFromContext.solved_problem[i].id === problem_id) {
                return '✔'
            }
        }

        for(let i = 0; i < userFromContext.unsolved_problem.length; i++){
            if(userFromContext.unsolved_problem[i].id === problem_id) {
                return '❌'
            }
        }

        return '-'

    }


  return (
    <div>
        {!problem && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {problem && <div>
        <div className="flex flex-wrap container mx-auto p-4">
                <div className="mx-auto">
                    <div className="p-2 m-2 font-black text-3xl text-blue-600">Problem</div>
                </div>
            </div> 
            
            <div className="flex flex-wrap container mx-auto p-4">
                <div className="mx-auto">
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}}>Page</button>
                    <input type="number" value={page} className="border border-blue-600 text-center" onChange={e => setPage( Math.max( parseInt(e.target.value.trim()), 1 ) )} onKeyPress={handleEnter}/>
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}} onClick={goto}>&#8611;</button>
                </div>
            </div> 

            <div className="flex flex-wrap container mx-auto">
                <table className="border-collapse border border-blue-600 mx-auto w-full">
                    <thead>
                        <tr>
                            <th className="border border-blue-600 p-2 text-lg">No.</th>
                            <th className="border border-blue-600 p-2 text-lg">ID</th>
                            <th className="border border-blue-600 p-2 text-lg"><input className="h-full w-full text-center" onKeyPress={e => handleEnter(e)} value={title} placeholder="Title" onChange={e => setTitle(e.target.value)}/></th>
                            {userFromContext && <th className="border border-blue-600 p-2 text-lg">Status</th>}
                            <th className="border border-blue-600 p-2 text-lg">Tag</th>
                            <th className="border border-blue-600 p-2 text-lg">Success / Attempt</th>
                            { (problem[0]?.disable === true || problem[0]?.disable === false) && <th className="border border-blue-600 p-2 text-lg">Disable</th>}
                            { (problem[0]?.disable === true || problem[0]?.disable === false) && <th className="border border-blue-600 p-2 text-lg">Edit</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            problem.map((each, index) => {
                                return (
                                    <tr>
                                        <td className="border border-blue-600 p-2 text-center">{index + 1 + ((query.page || 1) - 1) * PAGINATION}</td>
                                        <td className="border border-blue-600 p-2 text-center font-black"><Link to={`/problem/${each.id}`}>{each.id}</Link></td>
                                        <td className="border border-blue-600 p-2 text-center font-black"><Link to={`/problem/${each.id}`}>{each.title}</Link></td>
                                        {userFromContext && <td className="border border-blue-600 p-2 text-center"> {putStatusIcon(each.id)} </td>}
                                        <td className="border border-blue-600 p-2 text-center">{each.tag}</td>
                                        <td className="border border-blue-600 p-2 text-center"><Link to={"/status?problem_id=" + each.id}><label className="underline">{each.success}</label> / <label className="underline">{each.attempt}</label></Link></td>
                                        { (problem[0]?.disable === true || problem[0]?.disable === false) && <td className="border border-blue-600 text-center">{each.disable ? "True": "False"}</td>}
                                        { (problem[0]?.disable === true || problem[0]?.disable === false) && <td className="border border-blue-600 text-center"> <button className="p-1 m-1 rounded bg-blue-600 text-white"> <Link to={"/edit?problem_id=" + each.id}>Edit</Link> </button> </td>}
                                    </tr>
                                )   
                            })
                        }
                    </tbody>
                </table>
            </div>
            </div>
            }
    </div>
  );
}

export default Problem;
