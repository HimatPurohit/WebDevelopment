import React from 'react';

let year=new Date().getFullYear();

function Footer(){
    return <footer><p>Copyright &copy; {year}</p></footer>;
}

export default Footer;