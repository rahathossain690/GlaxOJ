const {writeFileSync, unlinkSync} = require('fs')
const {spawn, execFile} = require('child_process')
const {Readable} = require("stream");
const path = require('path')
module.exports =  class Runner {

    /**
     * 
     * @param {String} souce_code | text string containing source code 
     * @param {String} extension | enum {"cpp"} currently
     * @param {String} input
     * @param {Number} timelimit | milliseconds
     * @param {Number} IMMUNE_TIME_BONUS | milliseconds
     * @param {String} TEST_DIRECTORY | default 'TEST'
     * @param {Number} MAX_TIME_LIMIT | default 3000 milliseconds
     */


    constructor(souce_code, extension, input, timelimit, IMMUNE_TIME_BONUS = 100, TEST_DIRECTORY = __dirname, MAX_TIME_LIMIT = 3000) {
        this.souce_code = souce_code
        this.extension = extension
        this.input = input
        this.timelimit = timelimit
        this.IMMUNE_TIME_BONUS = IMMUNE_TIME_BONUS
        this.FILENAME = `${this.randomstring()}${Date.now()}${this.randomstring()}` // highly likely to be unique i guess
        this.TEST_DIRECTORY = TEST_DIRECTORY
        this.MAX_TIME_LIMIT = MAX_TIME_LIMIT
        this.COMPILED_FILE_PATH = path.join(this.TEST_DIRECTORY, `${this.FILENAME}.out`)
        this.SOURCE_FILE_PATH = path.join(this.TEST_DIRECTORY, `${this.FILENAME}.cpp`)
    }

    randomstring(size=5) {
        let str = "";
        for(let i = 0; i < 5; i++){
            str += "0123456789"[ Math.floor(Math.random() * 10) ]
        }
        return str;
    }

    compile() {

        return new Promise((resolve, reject) => { 
            this.save_file(this.SOURCE_FILE_PATH)
            if(this.extension === 'cpp') {
                const compiler = spawn('g++', [`${this.SOURCE_FILE_PATH}`, '-o',`${this.COMPILED_FILE_PATH}`]);
                compiler.stderr.on('data', (data) => {
                    reject();
                });
                compiler.on('close', (data) => {
                    if(data === 0) 
                        resolve()
                    else 
                        resolve()
                });
            } else {
                resolve(true)
            }
        })
    }

    save_file(filepath) {
        try{
            writeFileSync(filepath, this.souce_code);
        } catch(err){
            // console.log(err.message)
        }
    }

    delete_file(file){
        try{
            unlinkSync(file)
        } catch(err){
            // console.log(err.message)
        }
    }

    execute() {
        //console.log('came 1')
        return new Promise((resolve, reject) => { 
            try{ //console.log('came 2')
                let executor = null, start_time = Date.now();
                executor = execFile(this.COMPILED_FILE_PATH, {stdio: ['inherit', 'inherit', 'inherit', 'ipc']}); //console.log('came 3')
                this.over_the_time_limit = false;
                const timeout = setTimeout(() => {
                    this.over_the_time_limit = true;
                    try{
                        executor.stdin.pause()
                        executor.kill()
                    } catch(err){

                    }
                }, Math.max(this.timelimit, this.MAX_TIME_LIMIT))
                let output = "";


                executor.stdout.on('data', (data) => {
                    output += data 
                });

                executor.stderr.on('data', (data) => { 
                    clearTimeout(timeout)
                    reject( new Error("Runtime Error") )
                });

                executor.on('close', code => {
                    clearTimeout(timeout)
                    if(this.over_the_time_limit) {
                        reject( new Error("Time Limit Exceeded") )
                    }
                    if(code === null) {
                        reject( new Error("Memory Limit Exceeded") )
                    } else if(code === 0) {
                        resolve( [String(output), Date.now() - start_time])
                    } else { 
                        reject( new Error("Runtime Error") );
                    }
                })
                const stdinStream = new Readable();
                stdinStream.push(this.input);
                stdinStream.push(null);
                stdinStream.pipe(executor.stdin).on('error', (err) => {
                    // no need to push
                    // console.log(err)
                });

            } catch(err) {
                reject( new Error("Runtime Error") )
            }
        })
    }

    run() {

        return new Promise((resolve, reject) => {
            let compiled = false;
            this.compile()
                .then(() => { //console.log('compiled')
                    compiled = true
                })
                .catch(() => { //console.log('compiled error')
                    throw new Error('Compilation Error')
                })
                .then(() => {
                    return this.execute()
                })
                .then(output => { //console.log('executed')// [output, timelimit]
                    this.check_for_immunity(output[1])
                    resolve({
                        success: true,
                        output: output[0],
                        error: null, 
                        time: output[1]
                    })
                })
                .catch(err => { //console.log('dont forget me', err)
                    reject({
                        success: false,
                        output: null,
                        error: (err && err.message) ? err.message : "Runtime Error", 
                        time: null
                    })
                })
                .finally(() => { //console.log('here')
                    try{
                        this.delete_file(`${this.SOURCE_FILE_PATH}`)
                        if(this.extension === 'cpp' && compiled) this.delete_file(`${this.COMPILED_FILE_PATH}`)
                    } catch(err){
                        // hehe
                    }
                })  
        })
    }

    check_for_immunity(time) {
        if(Math.min(this.MAX_TIME_LIMIT, this.timelimit) + this.IMMUNE_TIME_BONUS < time) throw new Error("Time Limit Exceeded")
    }
}
