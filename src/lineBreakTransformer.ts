



export class LineBreakTransformer {

    private container?: any = '';

    reset() {
        this.container = ''
    }

    transform(chunk: any, controller: any) {
        this.container += chunk;
        const lines: string[] = this.container.split('\r\n');
        this.container = lines.pop();
        lines.forEach(line => controller.enqueue(line));
    }

    flush(controller: any) {
        controller.enqueue(this.container);
    }
}