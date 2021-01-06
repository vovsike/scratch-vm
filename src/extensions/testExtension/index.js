// Core, Team, and Official extensions can `require` VM code:
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');

// ...or VM dependencies:
const formatMessage = require('format-message');

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class SomeBlocks {
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.ws = new WebSocket("ws://localhost:8888");
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: 'someBlocks',
            name: formatMessage({
                id: 'extensionName',
                default: 'Some Blocks',
                description: 'The name of the "Some Blocks" extension'
            }),
            blocks: [
                {
                    opcode: 'myReporter', // becomes 'someBlocks.myReporter'
                    text: formatMessage({
                        id: 'someBlocks.myReporter',
                        default: 'This will return true',
                        description: 'Label on the "myReporter" block'
                    }),
                    blockType: BlockType.REPORTER
                }
            ]
        };
    }

    myReporter (){
        if (this.connection()){
            this.ws.send("Test Message")
            const messagePromise = new Promise(resolve => {
                this.ws.onmessage = function(event) {
                    resolve(event.data);
                }
                });
            messagePromise.then(message => message);
            return messagePromise;
        }
        else{
            alert("Reconnecting to sensors, please try again")
        }
    }

    connection() {
        if (this.ws.readyState == 1){
            return true;
        }
        else{
            this.ws = new WebSocket("ws://localhost:8888");
        }
    }

}

module.exports = SomeBlocks;