
import React, { useContext, useEffect }  from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import queryString from 'query-string'
import ReactLoading from 'react-loading';

import {BACKEND_URL} from '../util/config'
import {UserContext} from '../util/UserContext'


function NF() {
    const query = queryString.parse(useLocation().search) 
    const history = useHistory()
    
    //console.log(query)
    const [userFromContext, setUserFromContext] = useContext(UserContext)

    useEffect(()=>{

        try{

            (async()=>{

                const response = await fetch( `${BACKEND_URL}/auth`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(query)
                  })
                  const data = await response.json()
                  if(data.success === "no") {
                      // fuck off
                  } else {
                      // get user data
                    const response2 = await fetch( `${BACKEND_URL}/user`, {
                        credentials: 'include',
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                      })
                      const data2 = await response2.json()
                      
                    //   console.log(data2)
                      if(data2.success === "yes") {
                          setUserFromContext(data2.data)
                      } 
                      history.push('/')


                  }


            })()

        } catch(err){

        }

    }, [])

  return (
    <div>
      <div className="flex flex-wrap container mx-auto p-4 m-4">
            <ReactLoading type={"spokes"} color={"#2563EB"} height={200} width={200} className="mx-auto"/>
          </div> 
    </div>
  );
}

export default NF;
