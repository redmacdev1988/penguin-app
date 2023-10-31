
import { useRadio, Box, Heading } from '@chakra-ui/react'

const RadioCard = (props) => {
    const { getInputProps, getRadioProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Box as='label' style={{width: '45%'}}>
        <input  {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={5}
          py={3}
        >
          <Heading size="lg" fontFamily={"mono"} color={"white"}>{props.children}</Heading>
        </Box>
      </Box>
    )
  }

  export default RadioCard