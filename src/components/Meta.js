import App from "../App";
import MetaTags from 'react-meta-tags';

const meta = {
    title: 'HUH Claim Page',
    description: 'HUH claim page for presale purchasers',
    canonical: 'https://claim.huh.social',
    meta: {
        charset: 'utf-8',
        name: {
            keywords: 'presale,claim,purchasers,huh.social,huh'
        }
    }
};
export default function Meta(props) {
    const { app } = props
    return (
        <div className="wrapper">
        <MetaTags>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="canonical" content={meta.canonical} />
            <meta charSet={meta.meta.charset}/>
            <meta property="og:title" content={meta.title} />
            <meta property="og:image" content="logo512.png" /> 
        </MetaTags>
          <App {...app}/>
        </div>
    );
}