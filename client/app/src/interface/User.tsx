export default interface User{
    id: number|null,
    email: string|null,
    type: string|null,
    username: string|null,
    exp: number,
    iat: string|Date|number,   
}
