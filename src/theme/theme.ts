const theme = extendTheme({
  ...foundations,
  fonts: {
    heading: `'Gloria Hallelujah', cursive`,
    body: `'Gloria Hallelujah', cursive`,
  },
  styles: {
    global: (props: any) => ({
      html: {
        fontFamily: `'Gloria Hallelujah', cursive !important`,
      },
      body: {
        bg: mode('white', 'navy.900')(props),
        fontFamily: `'Gloria Hallelujah', cursive !important`,
      },
      '#root': {
        fontFamily: `'Gloria Hallelujah', cursive !important`,
      },
      '*': {
        fontFamily: `'Gloria Hallelujah', cursive !important`,
      },
    }),
  },
  ...components,
}); 