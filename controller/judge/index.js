const Runner = require('./Runner')
const tq = require('task-queue');
const path = require('path')

const fs = require('fs')
const PATH = path.join(__dirname, 'TEST')

try {
    if (fs.existsSync(PATH.toString())) {
      //file exists
    } else {
        fs.mkdirSync(PATH.toString());
    }
  } catch(err) {
    console.error(err)
  }

const queue = tq.Queue({
    capacity:  parseInt(process.env.JUDGE_QUEUE_CAPACITY) ,
    concurrency: parseInt(process.env.JUDGE_QUEUE_CONCURRENCY) 
});

module.exports = {
    start_judge_queue: () => {
        queue.start()
    },
    stop_judge_queue: () => {
        queue.stop()
    },
    // main judge driver
    add_to_queue: async ({submission_id, source_code, language, inputs, outputs, time_limit}, callback) => {
        
        queue.enqueue(async () => {

            // console.log(submission_id, source_code, language, inputs, outputs, time_limit)
            let verdict = 'Accepted';
            for(let i = 0; i < inputs.length; i++) {
                try{
                    const result = await new Runner(source_code, language, inputs[i], time_limit * 1000, null, PATH).run()
                    if(result.output !== outputs[i]){
                        verdict = 'Wrong Answer'
                        break;
                    }
                } catch(err){ //console.log(err)
                    const error_msg = err.error
                    if(error_msg !== "Time Limit Exceeded" && error_msg !== "Compilation Error" && error_msg !== "Memory Limit Exceeded" && error_msg !== "Runtime Error") {
                        error_msg = "Unknown Error"
                    }
                    verdict = error_msg
                    break;
                }
            }
            // console.log(verdict)
            callback(verdict)
        })

    },
    judge_state: () => {
        return queue.isRunning()
    },
    size: () => {
        return queue.size()
    }
}
