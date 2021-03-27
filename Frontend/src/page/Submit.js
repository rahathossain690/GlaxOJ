
import React, { useState }  from 'react';
import { useHistory } from 'react-router';

import {BACKEND_URL} from '../util/config'
import AceEditor from "react-ace";

function Submit(props) {
    const [problemId, setProblemId] = useState( props.match.params.problem_id )
    const [language, setLanguage] = useState( props.match.params.language )
    const [code, setCode] = useState("")
    const [buttonDisable, setButtonDisable] = useState(false)
    const [error, setError] = useState("")
    const history = useHistory()

    const submit = async () => {
        if(!language) {
            setError('Language is required')
            return;
        }
        if(buttonDisable) {
            setError('Slow down');
            return;
        }
        setButtonDisable(true);
        try{
            const post_data = {
                source_code: code,
                language,
                problem_id: problemId
            }
            // //console.log(post_data)
            const response = await fetch( `${BACKEND_URL}/submission/submit`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post_data)
              })
            const response_data = await response.json()
            if(response_data.success === "yes") {
                history.push(`/submission/${response_data.data.id}`)
                setError("")
            } else{
                setButtonDisable(false)
                setError(response_data.message)
            }
        }catch(err){
            //console.log(err)
            setError('Error encountered')
        }
    }


  return (
    <div>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-3xl font-black text-blue-600">Submit</span>
        </div>
        <br/>
        <div className="flex flex-wrap container mx-auto">
            <div className="mx-auto">
                <input type="number" className="border border-blue-600 text-center m-2 p-1" value={problemId} onChange={e => setProblemId(e.target.value)} placeholder="Problem ID"/>
                <select id = "verdictList" onChange={e => setLanguage(e.target.value)} value={language} className="border border-blue-600 text-center m-2 p-1">
                    <option value="">Language</option>
                    <option value="cpp">cpp</option>
                </select>
            </div>
        </div>
        <div className="flex flex-wrap container mx-auto">
            {/* <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                highlight={code => code}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    minHeight: '500px'
                }}
                className="w-full border-2 border-blue-600 rounded bg-gray-200 p-4"
                placeholder="Your Code Goes brrr..."
            /> */}
            <AceEditor
                onChange={e => setCode(e)}
                name="Code editor"
                editorProps={{ $blockScrolling: true }}
                className="w-full border border-blue-600"
                placeholder="Code goes here brr..."
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: true,
                    highlightActiveLine: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        </div>
        {error && <div className="flex flex-wrap container mx-auto">
            <div className="mx-auto p-2 m-2 text-red-600" onClick={e => submit()}>{error}</div>
        </div>}
        <div className="flex flex-wrap container mx-auto">
            <button className="mx-auto p-2 m-2 bg-blue-600 text-white rounded focus:bg-blue-700 focus:text-white" onClick={e => submit()} disabled={buttonDisable}>Submit</button>
        </div>
        
    </div>
  );
}

export default Submit;
