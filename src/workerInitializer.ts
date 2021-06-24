export function setupWorker(w: Worker & WorkerNavigator):void {

    if (!w.serial) {
        throw new Error("Trying to ");
    }

    w.addEventListener('message', function(event) {

    })


    if ('development' === process.env.NODE_ENV) {
        console.log('boop');
    }

}
