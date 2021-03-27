
import React, { useEffect, useState }  from 'react';

import {Link, useHistory, useLocation } from 'react-router-dom';
import ReactLoading from 'react-loading';
import queryString from 'query-string'

// import EditorJs from 'react-editor-js';
// import RichTextEditor from 'react-rte';

// import { EDITOR_JS_TOOLS } from '../util/tool'
// console.log(EDITOR_JS_TOOLS)
// import Header from '@editorjs/header'
import {BACKEND_URL} from '../util/config'

/**
 * 
 * id
 * memory_limit
 * time_limit
 * content
 * inputs
 * outputs
 * title
 * tag
 * author
 */

function EditProblem() {

    const query = queryString.parse(useLocation().search) 
    const history = useHistory()
    const problem_id = query.problem_id
    const [memoryLimit, setMemoryLimit] = useState(32)
    const [timeLimit, setTimeLimit] = useState(1)
    const [content, setContent] = useState( null )
    const [inputs, setInputs] = useState([])
    const [outputs, setOutputs] = useState([])
    const [title, setTitle] = useState("")
    const [tag, setTag] = useState("")
    const [author, setAuthor] = useState("")
    const [disable, setDisable] = useState(false)
    // const [sampleInput, setSampleInput] = useState("")
    // const [sampleOutput, setSampleOutput] = useState("")
    const [loading, setLoading] = useState(true)
    // const [testCaseFile, setTestCaseFile] = useState([])
    const [noOfTestCase, setNoOfTestCase] = useState(0)
    const [error, setError] = useState("")

    
    const temporary_inputs = [...Array(20)].map(x => null)
    const temporary_outputs = [...Array(20)].map(x => null)
    
    for(let i = 0; i < noOfTestCase; i++) {
        temporary_inputs[i] = inputs[i]
        temporary_outputs[i] = outputs[i]
    }


    useEffect(() => {

        try{

            (async() => {

                const response = await fetch( `${BACKEND_URL}/user/is_admin`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  })
                const data = await response.json()
                if(data.success === "yes") {
                    if(problem_id) {
                        const response2 = await fetch( `${BACKEND_URL}/problem?id=${problem_id}&admin=true`, {
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                          })
                        const data2 = await response2.json()
                        if(data2.success === "yes") {
                            const problem = data2.data
                            //console.log(problem)
                            setAuthor(problem.author)
                            setTitle(problem.title)
                            setTimeLimit(problem.time_limit)
                            setMemoryLimit(problem.memory_limit)
                            setTag(problem.tag.join(', '))
                            setDisable(problem.disable)
                            setNoOfTestCase(problem.inputs.length)
                            setContent(problem.content)
                            setInputs(problem.inputs)
                            setOutputs(problem.outputs)

                            // setDescription(content.description)
                            // setInputSpecification(content.inputSpecification)
                            // setOutputSpecification(content.outputSpecification)
                            // setSampleTestCase(content.sampleTestCase)
                            // setNote(content.note)
                            

                            setLoading(false)
                        } else {
                            history.push('/404')
                            history.go(0)
                        }
                    }
                    setLoading(false)
                } else{
                    history.push('/404')
                    // history.go(0)
                }

            })()

        }catch(err){
            // console.log(err)
            setError(err.message)
        }


    }, [])


    const submit = async () => {
        // set inputs / outputs first
        // console.log(temporary_inputs, temporary_outputs)
        // setInputs(temporary_inputs.splice(0, noOfTestCase))
        // setOutputs(temporary_outputs.splice(0, noOfTestCase))
        // console.log(inputs, outputs)
        // return;
        const post_data = {}
        /**
         * 
         * id
         * memory_limit
         * time_limit
         * content
         * inputs
         * outputs
         * title
         * tag
         * author
         */
        //console.log(inputs, outputs)
        if(inputs.length !== outputs.length || inputs.length == 0 || outputs.length == 0) { //console.log('1')
            setError('Set inputs and outputs carefully')
            return;
        }
        for(let index = 0; index < inputs.length; index++) {
            if(!outputs[index] || !inputs[index]) {//console.log('1')
                setError('Set inputs and outputs carefully')
                return;
            }
        }
        post_data.memory_limit = memoryLimit
        post_data.time_limit = timeLimit
        post_data.content = content
        post_data.title = title
        post_data.tag = tag.split(',')
        post_data.author = author
        post_data.disable = disable
        post_data.inputs = inputs
        post_data.outputs = outputs
        //console.log(post_data)

        if(problem_id) { // it is an edit request
            const response = await fetch( `${BACKEND_URL}/problem?id=${problem_id}`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post_data)
              })
            const response_data = await response.json()
            if(response_data.success === "yes") {
                setError('')
                history.push('/problem?admin=true')
                history.go(0)
            } else {
                setError(response_data.message)
            }

        } else { // create request
            const response = await fetch( `${BACKEND_URL}/problem/`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post_data)
              })
            const response_data = await response.json()
            if(response_data.success === "yes") {
                setError('')
                history.push('/problem?admin=true')
                //history.go(0)
            } else {
                setError(response_data.message)
            }
        }

    }



    const setOutputEach = (index, value) => {
        // console.log(index, value)
        // let temp = outputs;
        // if(temp.length !== noOfTestCase) temp = [...Array(noOfTestCase)].map(x => null);
        // temp[index] = value
        // setOutputs(temp)
        temporary_outputs[index] = value
        const next_temp = []
        for(let i = 0; i < noOfTestCase; i++) next_temp.push(temporary_outputs[i])
        setOutputs(next_temp)
    }

    const setInputEach =  (index, value) => {
        // console.log(index, value)
        // if(inputs.length !== noOfTestCase) setInputs([...Array(noOfTestCase)].map(x => null))
        // const temp = inputs
        // temp[index] = value
        // setInputs(temp)
        temporary_inputs[index] = value
        const next_temp = []
        for(let i = 0; i < noOfTestCase; i++) next_temp.push(temporary_inputs[i])
        setInputs(next_temp)
    }

    const deleteProblem = async()=> {
        const response = await fetch( `${BACKEND_URL}/problem?id=${problem_id}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
          })
        const response_data = await response.json()
        if(response_data.success === "yes") {
            setError('')
            history.push('/problem?admin=true')
            //history.go(0)
        } else {
            setError(response_data.message)
        }
    }

    const handleResetTestCases = () => {
        setNoOfTestCase(0)
        setInputs([])
        setOutputs([])
    }

  return (
    <div>
        {loading && <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {!loading && <div>

            <div className="flex flex-wrap container mx-auto items-center justify-between">
                <div className="mx-auto text-3xl text-blue-600 font-black"> Edit Problem </div>
            </div>

            <div className="flex flex-wrap container mx-auto">
                <table className="mx-auto w-full">
                    <tbody>
                        <tr>
                            <th className="border border-blue-600 p-1">Instructions</th>
                            <td className="border border-blue-600 p-1"> 

                            <div><ol>
                                <li>1. Title should be unique and not empty</li>
                                <li>2. 1 ≤ Time Limit (≤ 3 Judge currenlty doesn't support more than 3 second)</li>
                                <li>3. 1 ≤ Memory Limit </li>
                                <li>4. Seperate tags by comma </li>
                                <li>5. Content should be html. You can use <a href="https://www.w3schools.com/tryit/tryit.asp?filename=tryhtml_default">https://www.w3schools.com/tryit/tryit.asp?filename=tryhtml_default</a> or other resources for this purpose</li>
                                <li>6. At most 10 test cases allowed </li>
                            </ol></div>
                            
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">ID</th>
                            <td className="border border-blue-600 p-1"> <input type="text" className="h-full w-full" placeholder="ID" value={problem_id} disabled={true}/> </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Toggle Disablity</th>
                            <td className="border border-blue-600 p-1 mx-auto"> <button className="p-1 m-1 bg-blue-600 text-white mx-auto rounded focus:bg-blue-700 focus:text-white" onClick={e => setDisable(!disable)}>{disable? "True": "False"}</button> </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Title</th>
                            <td className="border border-blue-600 p-1"> <input type="text" className="h-full w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}/> </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Time Limit</th>
                            <td className="border border-blue-600 p-1"> <input type="number" className="h-full w-full" placeholder="Time Limit (second)" value={timeLimit} onChange={e=>setTimeLimit(Math.max(parseInt(e.target.value)) || 1, 1)}/> </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Memory Limit</th>
                            <td className="border border-blue-600 p-1"> <input type="number" className="h-full w-full" placeholder="Memory Limit (MB)" value={memoryLimit} onChange={e=>setMemoryLimit(Math.max(parseInt(e.target.value)) || 1, 1)}/> </td>
                        </tr>
                        <tr>
                            <th className="border border-blue-600 p-1">Tag</th>
                            <td className="border border-blue-600 p-1"> <input type="text" className="h-full w-full" placeholder="Tag (CSV)"  value={tag} onChange={e=>setTag(e.target.value)}/> </td>
                        </tr>

                        <tr>
                            <th className="border border-blue-600 p-1">Author</th>
                            <td className="border border-blue-600 p-1"> <input type="text" className="h-full w-full" placeholder="Author"  value={author} onChange={e=>setAuthor(e.target.value)}/> </td>
                        </tr>

                        <tr>
                            <th className="border border-blue-600 p-1">Content</th>
                            <td className="border border-blue-600 p-1"> <textarea className="w-full" placeholder="Content (html)"  value={content} onChange={e=>setContent(e.target.value)}/> </td>
                        </tr>

                        
                        <tr>
                            <th className="border border-blue-600 p-1">Preview</th>
                            <td className="border border-blue-600 p-1"> <div classNam="w-full" dangerouslySetInnerHTML={{__html: content}}/> </td>

                        </tr>

                        <tr>
                            <th className="border border-blue-600 p-1">No of test cases</th>
                            <td className="border border-blue-600 p-1"> <input type="number" className="h-full w-full" placeholder="No of test cases" value={noOfTestCase} onChange={e=>setNoOfTestCase( Math.min(10, Math.max(parseInt(e.target.value) || 1, 1)) )}/> </td>
                        </tr>
                    </tbody>
                </table>
                    <br/><br/>
                <div className="flex flex-wrap container mx-auto">
                    <table className="w-full">
                        <tr>
                            <th className="border border-blue-600">Test No</th>
                            <th className="border border-blue-600">Input</th>
                            <th className="border border-blue-600">Output</th>
                        </tr>

                        {
                            [...Array(noOfTestCase)].map((tc, index) => {
                                return (
                                    <tr>
                                        <td  className="border border-blue-600 text-center">{index + 1}</td>
                                        <td className="border border-blue-600"> <textarea type="text" className=" w-full" style={{maxHeight: '300px'}} placeholder="Paste inputs" value={inputs[index]} onChange={e => setInputEach(index, e.target.value)}/> </td>
                                        <td className="border border-blue-600"> <textarea type="text" className="w-full" style={{maxHeight: '300px'}} placeholder="Paste outputs" value={outputs[index]} onChange={e => setOutputEach(index, e.target.value)}/></td>    
                                    </tr>
                                )
                            })
                        }

                    </table>
                </div>

                {error && <div className="flex flex-wrap container mx-auto">
                    <div className="p-1 m-1 text-red-600 mx-auto">{error}</div>
                </div>}

                <div className="flex flex-wrap container mx-auto p-1 m-1">
                    {/* <Link target="_blank" to={"/preview?" + queryString.stringify({time_limit: timeLimit, memory_limit: memoryLimit, content, title, author})}><button className="p-1 m-1 text-white bg-blue-600 mx-auto">Preview</button></Link> */}
                    <button className="p-1 m-1 text-white bg-blue-600 mx-auto rounded focus:bg-blue-700 focus:text-white" onClick={e => handleResetTestCases()}>Clear Test Cases</button>
                    <button className="p-1 m-1 text-white bg-blue-600 mx-auto rounded focus:bg-blue-700 focus:text-white" onClick={submit}>Save</button>
                    <button className="p-1 m-1 text-white bg-blue-600 mx-auto rounded focus:bg-blue-700 focus:text-white" onClick={deleteProblem}>Delete</button>
                </div>
            </div>



        </div>
        }
        
    </div>
  );
}

export default EditProblem;
