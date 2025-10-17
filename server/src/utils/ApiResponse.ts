class ApiResponse<T>{
    statusCode: number;
    message: string;
    data : T | undefined;
    success:boolean;

    constructor(statusCode : number, message : string = "Successful",data?:T) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success  = (statusCode < 300);
    }
}

export default ApiResponse;