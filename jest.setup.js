const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.warn = (...args) => {
    const joined = args.map(arg => String(arg)).join(' ');
    if (
      joined.includes('React Router Future Flag Warning') ||
      joined.includes('v7_startTransition') ||
      joined.includes('v7_relativeSplatPath')
    ) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    const joined = args.map(arg => String(arg)).join(' ');
    if (
      joined.includes('ReactDOMTestUtils.act') ||
      joined.includes('Missing bucket name') ||
      joined.includes('NoBucket') ||
      joined.includes('Cannot read properties of undefined') ||
      joined.includes('Error fetching forms from S3:') ||
      joined.includes('Error fetching events:')
    ) return;
    originalError(...args);
  };

  console.log = (...args) => {
    const joined = args.map(arg => String(arg)).join(' ');
    if (
      joined.includes('Listing all from public/uploads') ||
      joined.includes('Event deleted successfully') ||
      joined.includes('Deleting event ID')
    ) return;
    originalLog(...args);
  };
});
