
import React, { useContext, useEffect, useState }  from 'react';

import {BACKEND_URL} from '../util/config'
import ReactLoading from 'react-loading';
import { Link, useHistory } from 'react-router-dom';

import {UserContext} from '../util/UserContext'

function User(props) {
    const username = props.match.params.username
    // console.log(username)
    const [user, setUser] = useState(null)
    const history = useHistory()

    const [userFromContext, setUserFromContext] = useContext(UserContext)

    //console.log(userFromContext)


    useEffect( () => {

        // history.go(0)

        (async() => {
            
            try{

                setUser(null)

            const response = await fetch( `${BACKEND_URL}/user?username=${username}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
              })
              const user_data = await response.json()
              if(user_data.success === "yes") setUser(user_data.data)
              else {
                  history.push('/404')
                //   history.go(0)
              }
            } catch(err){
                // console.log(err)
                history.push('/404')
                // history.go(0)
            }
        })()


    }, [username])

    const changeAdmin = async()=>{
        try {
            let admin = !(user.role && user.role.indexOf('ADMIN') !== -1)
            //console.log(`${BACKEND_URL}/user?username=${username}&admin=${admin}`)
            const response = await fetch( `${BACKEND_URL}/user?username=${username}&admin=${admin}`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
              })
              const user_data = await response.json()
            //   setUser(user_data.data)
            if(user_data.success === "yes") {
                history.go(0)
            }

            // console.log(user_data)

        } catch(err){
            // console.log(err)
        }
    }

    const changeDisable = async()=>{
        try {
            let disable = !(user.disable)
            const response = await fetch( `${BACKEND_URL}/user?username=${username}&disable=${disable}`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
              })
              const user_data = await response.json()
            //   console.log(user_data)
            //   setUser(user_data.data)

            if(user_data.success === "yes") {
                history.go(0)
            }

        } catch(err){
            // console.log(err)
        }
    }

    const logout = async ()=> {
        try {
            const response = await fetch( `${BACKEND_URL}/user/logout`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
              })
              const user_data = await response.json()

            if(user_data.success === "yes") {
                setUserFromContext(null)
                history.push('/')
                // history.go(0)
            }

        } catch(err){
            // console.log(err)
        }
    }


  return (

        <div>
        { !user && <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
            </div>
        }
        {user && 
        <div>    
            <div className=" flex flex-wrap container mx-auto">
                <div className="mx-auto text-blue-600 text-2xl p-2 m-2 font-black">User Info</div>
            </div>
            <div className="container mx-auto grid grid-cols-2 p-4 border border-black justify-between items-center">
                <div className="mx-auto">
                    <div className="flex flex-wrap container mx-auto">
                        <div className="mx-auto text-blue-600 font-black text-xl">{user.username}</div>
                    </div>
                    <div className="flex flex-wrap container mx-auto">
                        <div className="mx-auto text-sm text-blue-500">{user.role?.join(', ')}</div>
                    </div>
                </div>
                <img src={user.image} className="rounded-full shadow-xl mx-auto" alt={user.fullname}></img>
            </div>
            
            <br/>
            <div className=" flex flex-wrap container mx-auto">
                {/* <button className="bg-blue-600 p-1 m-4 rounded text-white mx-auto">Submissions</button> */}
                <table className="border-collapse border border-green-800 mx-auto w-full">
                    <tbody>
                        <tr>
                            <th className="border border-blue-600 p-1">Name</th>
                            <td className="border border-blue-600 p-1 text-center">{user.fullname}</td>
                        </tr>


                        {user.email && <tr>
                            <th className="border border-blue-600 p-1">Email</th>
                            <td className="border border-blue-600 p-1 text-center">{user.email}</td>
                        </tr>}

                        <tr>
                            <th className="border border-blue-600 p-1">Solved</th>
                            <td className="border border-blue-600 p-1 text-center">{user.solved_problem.length}</td>
                        </tr>
                        
                        
                        <tr>
                            <th className="border border-blue-600 p-1">Submissions</th>
                            <td className="border border-blue-600 p-1 text-center">{user.total_submission}</td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Account Created At</th>
                            <td className="border border-blue-600 p-1 text-center">{new Date(user.createdAt).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className=" flex flex-wrap container mx-auto">
                <Link to={`/status?username=${user.username}`} className="mx-auto"><button className="bg-blue-600 p-1 m-4 rounded text-white mx-auto focus:bg-blue-700 focus:text-white">View Submissions</button></Link>
                {userFromContext && userFromContext.username === user.username && <button className="bg-blue-600 p-1 m-4 rounded text-white mx-auto focus:bg-blue-700 focus:text-white" onClick={logout}>Logout</button>}
            </div>
            <br/>
            <div className="flex flex-wrap container mx-auto">
                <table className="w-full">
                    <tr>
                        <th className="border border-blue-600 w-2/12 p-1  min-w-sm">Solved Problem(s)</th>
                        <td className="border border-blue-600 p-1">
                            
                                {user.solved_problem.map((each, index) => {
                                    return (
                                        <span>
                                            <span title={each.title} className="font-black"><Link to={"/problem/" + each.id}>{each.id}</Link></span>{index===user.solved_problem.length-1?"":", "}
                                        </span>
                                    )
                                })}

                        </td>
                    </tr>
                    <tr>
                        <th className="border border-blue-600 w-2/12 p-1 min-w-sm">Tried Problem(s)</th>
                        <td className="border border-blue-600 p-1">
                            {user.unsolved_problem.map((each, index) => {
                                    return (
                                        <span>
                                            <span title={each.title} className="font-black"><Link to={"/problem/" + each.id}>{each.id}</Link></span>{index===user.unsolved_problem.length-1?"":", "}
                                        </span>
                                    )
                                })}
                        </td>
                    </tr>
                </table>
            </div>
            { userFromContext && userFromContext.role && userFromContext.role.indexOf('ADMIN') !== -1 &&  <div className="flex flex-wrap container mx-auto items-justify">
                <button className="bg-blue-600 p-1 m-4 rounded text-white mx-auto text-center focus:bg-blue-700 focus:text-white" onClick={changeAdmin}>{(user.role && user.role.indexOf('ADMIN') !== -1)? "Remove Admin" : "Make Admin"}</button>
                <button className="bg-blue-600 p-1 m-4 rounded text-white mx-auto focus:bg-blue-700 focus:text-white" onClick={changeDisable}>{!user.disable ? "Disable" : "Enable"}</button>
            </div>
            }
        </div>}
    </div>


  );
}

export default User;
