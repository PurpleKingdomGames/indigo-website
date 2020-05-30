/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Indigo Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        <small>{props.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/indigo_logo_full.svg`} />
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href={docUrl('hello-indigo.html')}>Let's build a game</Button>
            <Button href="https://davesmith00000.github.io/snake-demo/">Quick game of snake?</Button>
            {/* <Button href="#try">Quick game of snake?</Button> */}
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    // const FeatureCallout = () => (
    //   <div
    //     className="productShowcaseSection paddingBottom"
    //     style={{textAlign: 'center'}}>
    //     <h2>Feature Callout</h2>
    //     <MarkdownBlock>These are features of this project</MarkdownBlock>
    //   </div>
    // );

    // const TryOut = () => (
    //   < Block id = "try"
    //   background = "light"
    //   layout = "fourColumn" >
    //     {[
    //       {
    //         content:
    //           '<h1>FISH</h1>',
    //         image: `${baseUrl}img/undraw_code_review.svg`,
    //         imageAlign: 'left',
    //         title: 'Quick game of snake?',
    //       },
    //     ]}
    //   </Block>
    // );

      const Description = () => (
        <div
          className="productShowcaseSection paddingBottom"
          style={{textAlign: 'left'}}>
          <h2>Let's have some fun.</h2>
          <MarkdownBlock>
_Seriously. Where are all the FP game engines?_
          </MarkdownBlock>
          <MarkdownBlock>
            Indigo was created for a very particular audience: Functional programmers who want a _code only_ engine aimed squarely at developer fun and productivity.
          </MarkdownBlock>
          <MarkdownBlock>
            Are you a Scala developer? Does writing 2D modern-retro games for the browser* in a purely functional style, exclusively using WebGL 2.0 (Argh! Browser compatibility!), using a code-only engine with no editor sound like your idea of a good time? Then Indigo might just possibly be the game engine you've been looking for!
          </MarkdownBlock>
          <MarkdownBlock>
            *(\* we hope to add more platforms in the future!)*
          </MarkdownBlock>
        </div>
      );

    // const LearnHow = () => (
    //   <Block background="light">
    //     {[
    //       {
    //         content:
    //           'Each new Docusaurus project has **randomly-generated** theme colors.',
    //         image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
    //         imageAlign: 'right',
    //         title: 'Randomly Generated Theme Colors',
    //       },
    //     ]}
    //   </Block>
    // );

    const Features = () => (
      <Block layout="twoColumn">
        {[
          {
            content: 'If you can write Scala, you can make games. Indigo is powered by Scala.js, and feels like a completely ordinary Scala project.',
            image: `${baseUrl}img/scala-lang.svg`,
            imageAlign: 'top',
            title: 'Nothing but Scala.',
          },
          {
            content: 'Confident development with Scala\'s advanced type system, purely functional APIs, and a completely deterministic game loop.',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            title: 'Easy to Type. Easy to Test.',
          },
          {
            content: 'Indigo was designed for crisp, beautiful pixel art that leverages modern rendering techniques like dynamic lighting.</br>(Also supports non-pixel art games!)',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            title: 'Big Beautiful Pixels.',
          },
          {
            content: 'Indigo will work with any build system that support Scala.js, and has additional tooling for SBT and Mill.',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            title: 'You favourite build tool.',
          },
        ]}
      </Block>
    );

    // const Showcase = () => {
    //   if ((siteConfig.users || []).length === 0) {
    //     return null;
    //   }

    //   const showcase = siteConfig.users
    //     .filter(user => user.pinned)
    //     .map(user => (
    //       <a href={user.infoLink} key={user.infoLink}>
    //         <img src={user.image} alt={user.caption} title={user.caption} />
    //       </a>
    //     ));

    //   const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

    //   return (
    //     <div className="productShowcaseSection paddingBottom">
    //       <h2>Who is Using This?</h2>
    //       <p>This project is used by all these people</p>
    //       <div className="logos">{showcase}</div>
    //       <div className="more-users">
    //         <a className="button" href={pageUrl('users.html')}>
    //           More {siteConfig.title} Users
    //         </a>
    //       </div>
    //     </div>
    //   );
    // };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          {/* <FeatureCallout /> */}
          {/* <LearnHow /> */}
          <Description />
          {/* <TryOut /> */}
          {/* <Showcase /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
