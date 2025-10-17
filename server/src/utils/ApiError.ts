class ApiError extends Error {
    statusCode : number;
    message: string;
    success:boolean;
    error ?: string[] | undefined;
    stack!: string;

    constructor(statusCode:number,message:string,error?:string[],stack?:string)
    {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.error = error;
        if (stack)
        {
            this.stack = stack;
        }
        else
        {
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export default ApiError;