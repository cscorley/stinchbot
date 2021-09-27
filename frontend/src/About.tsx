import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import "./Home.css";

import aboutBrowserSource from "./img/about_browser_source.png";

export class About extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>About Killer Queen Stats</h1>
        <h2>
          <i>on Heroku!</i>
        </h2>
        <p>
          This project is a spinoff of another dear love,{" "}
          <a href="https://github.com/killer-queen-stats/kqstats">kqstats</a>.
        </p>
        <h2>How to use this?</h2>
        <p>
          On the <a href="/">home page</a> from your streaming computer, at the
          top will be a connection test to validate your KQ cab address. If it
          is green ✅, then you can copy the link to the Killboard Layout you
          desire. If it is red ❓, then you can manually enter your KQ cabinet's
          LAN network address or hostname.
          <div className="alert alert-warning" role="alert">
            Make sure you are accessing the killboards using
            <code> http:// </code>
            and not <code> https://</code>.{" "}
            <a href="#https">Why doesn't this work over HTTPS?</a> This is the
            only time you should ever do this.
          </div>
        </p>

        <p>
          The default address is set to <code>kq.local</code>. For the majority
          of uses, this should work just fine. However, if it doesn't work for
          you, you can specify either a LAN network IP address or hostname if
          you know it. If your KQ cabinet address changes, you will need to
          update your OBS Browser source to the new address each time.
        </p>
        <h3>Setting up an OBS Browser Source</h3>
        <ul>
          <p>
            <a href={aboutBrowserSource}>
              <img
                src={aboutBrowserSource}
                alt="OBS Browser source fully configured"
                width="25%"
              />
            </a>
          </p>
          <li>
            In the OBS Browser Source, paste in the desired layout URL into the
            URL field. Make sure this uses "http" and not "https".
          </li>
          <li>
            Set width and height to the recommended values (either 1280x122, or
            500x2500).
          </li>
          <li>Check "Use custom framerate"</li>
          <li>Change FPS to 1</li>
          <li>
            Custom CSS should remain the default, which sets the layout to have
            a transparent background. Incase something happens, it is replicated
            here:{" "}
            <code>
              {
                "body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }"
              }
            </code>
          </li>
          <li>
            Check "Shutdown source when not visible". This saves resources in
            OBS and allows you to "reload" the killboard by hiding and showing
            it again.
          </li>
          <li>
            Check "Refresh browser when scene becomes active". This reloads the
            killboard whenever the OBS scene launches. It is helpful to reset
            the killboard if it is disconnected and has trouble reconnecting.
          </li>
        </ul>
        <h2>How does this work?</h2>
        <p>
          One of the drawbacks of the original kqstats is it required installing
          software on a computer somewhere, and then loading the pages that
          generated into OBS via a Browser Source. While this is a valid
          approach (and you may need it!), I felt that it was a barrier to entry
          for new KQ scenes that wanted that sweet sweet KDR on their streams.
        </p>
        <p>
          This spinoff of kqstats instead leverages the assumption that your
          streaming computer that runs OBS already has direct access to the KQ
          cabinet on the network. Instead of running an entire client/server
          stack, we just let OBS load a web page via Browser Source that
          contains a client that connects directly to the KQ cabinet instead.
        </p>
        <p>
          If that assumption (OBS is on the same network as KQ cabinet) does not
          hold for you, then this web site will not work for you, unfortunately.
          I recommend setting up the original kqstats.
        </p>
        <h2 id="https">Why doesn't this work over HTTPS?</h2>
        <p>
          The KQ cabinet serves the game data over a technology called
          WebSockets. WebSockets can either be secure or insecure, just like
          HTTP. Unfortunately, the KQ cabinet only uses an insecure WebSocket.
        </p>
        <p>
          Modern browsers will not allow the connection from an HTTPS site to an
          insecure WebSockets. Thus, to connect to an insecure WebSocket, you
          must be using insecure HTTP.
        </p>
      </div>
    );
  }
}
