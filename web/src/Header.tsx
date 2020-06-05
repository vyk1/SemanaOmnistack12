import React from 'react';

// FC => function component
// é generic => recebe parâmetro

// define a tipagem de um objeto
interface HeaderProps {
  // Opcional-> coloca ponto de interrogação
  title?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  )
}

export default Header;