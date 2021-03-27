
import React, {useEffect, useState}  from 'react';

import queryString from 'query-string'
import { Link, useLocation, useHistory } from 'react-router-dom'
import ReactLoading from 'react-loading';
import {BACKEND_URL, PAGINATION} from '../util/config'

function AdminUser() {

  const query = queryString.parse(useLocation().search) 
  const history = useHistory()
  const [page, setPage] = useState( Math.max(query.page || 1), 1 )
  const [userData, setUserData] = useState(null)

  const handleEnter = (event) => {
    if(event.key === 'Enter') goto()
}


  useEffect( () => {

    (async () => {
        try{
          console.log('fetching', `${BACKEND_URL}/user/all?page=${page}`)
          const response2 = await fetch( `${BACKEND_URL}/user/all?page=${page}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
          })
          const user_data = await response2.json()
          
          if(user_data.success === "yes") {
            setUserData(user_data.data)
          } else{
            throw new Error('Not found')
          }
      } catch(err){
        console.log(err)
      }

    })();
}, [])

  const set_page = (value) => {
    if(value >= 1) setPage(value) 
  }

  const goto = () => {
    const data = queryString.stringify({
      page,
    })
    history.push(`/admin/user?${data}`)
    history.go(0)
  }


  return (
    <div>
        {!userData && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {userData && 
          <div>
            <div className="flex flex-wrap container mx-auto">
                <span className="mx-auto text-3xl text-blue-600">Users</span>
            </div>
            <div className="flex flex-wrap container mx-auto p-4">
              <div className="mx-auto">
                <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}}>Page</button>
                <input type="number" value={page} className="border border-blue-600 text-center" onKeyPress={e => handleEnter(e)} onChange={e => set_page( parseInt(e.target.value.trim())) }/>
                <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}} onClick={goto}>&#8611;</button>
              </div>
            </div> 
            <div className="flex flex-wrap container mx-auto">
              <table className="border-collapse border border-blue-600 mx-auto w-full">
                <thead>
                  <tr>
                    <th className="border border-blue-600">No.</th>
                    <th className="border border-blue-600">Username</th>
                    <th className="border border-blue-600">Fullname</th>
                    <th className="border border-blue-600">Email</th>
                    <th className="border border-blue-600">Role</th>
                    <th className="border border-blue-600">disable</th>
                    <th className="border border-blue-600">createdAt</th>
                  </tr>
                </thead>
                <tbody>
                  { userData.map((user, index) => {
                    return (
                      <tr key={user.username}>
                        <td className="border border-blue-600 p-1">{index + 1 + ((query.page || 1) - 1) * PAGINATION}</td>
                        <td className="border border-blue-600 p-1 text-blue-600 font-black"><Link to={"/user/" + user.username}>{user.username}</Link></td>
                        <td className="border border-blue-600 p-1">{user.fullname}</td>
                        <td className="border border-blue-600 text-center p-1">{user.email}</td>
                        <td className="border border-blue-600 text-center p-1">{user?.role?.join(', ')}</td>
                        <td className="border border-blue-600 text-center p-1">{user.disable ? "True": "False"}</td>
                        <td className="border border-blue-600 text-center p-1">{user.createdAt}</td>
                      </tr>
                    )
                  }) }
                </tbody>
              </table>
            </div>

            
          </div>
        }
        
    </div>
  );
}

export default AdminUser;
