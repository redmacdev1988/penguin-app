'use client'

const ButtonSubmit = ({ value, ...props }) => {
  
  return (
    <button {...props}>
      {value}
    </button>
  )
}

export default ButtonSubmit