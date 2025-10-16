class ApiError extends Error {
    statusCode : number;
    message: string;
    success:boolean;
    error ?: any;
    stack ?: any;

    constructor(statusCode:number,message:string,error:any  = [],stack?:any)
    {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.error = error;
        if (this.stack)
        {
            this.stack = stack;
        }
        else
        {
            this.stack = Error.captureStackTrace(this);
        }
    }
}

export default ApiError;