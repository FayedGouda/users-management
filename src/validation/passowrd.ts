const strongPassword = (password:string):Boolean=>{
    const strongRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})'
    );
    return strongRegex.test(password);
}

export default strongPassword;