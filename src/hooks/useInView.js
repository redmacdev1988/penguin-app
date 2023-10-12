import { useState, useEffect, useRef } from 'react'

const useInView = () => {
  console.log('useInView start');

  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    console.log(`UseInView - Let's observe`);
    const el = ref.current;
    console.log('ref is: ', ref);
    
    const observer = new IntersectionObserver(entries => {
      console.log('ref-ed control appeared: ', entries[0].isIntersecting);
      setInView(entries[0].isIntersecting)
    })

    if(el) observer.observe(el)

    return () => {
      if(el) observer.unobserve(el)
    }
  }, []);

  return { ref, inView }
}

export default useInView