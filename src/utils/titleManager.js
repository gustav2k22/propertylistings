const baseTitle = 'Property Listings';

export const setPageTitle = (pageName) => {
  document.title = pageName ? `${baseTitle} || ${pageName}` : baseTitle;
}; 