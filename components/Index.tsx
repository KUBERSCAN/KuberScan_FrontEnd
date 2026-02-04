import Footer from "./Footer.tsx";
import Header from "./Header.tsx";

const Index = () => {
  return (
    <>
      <section class="main">
        <h1>
          <span>Kuberscan, your Kubernetes Incident Detector</span>
        </h1>
        <p>
          Kuberscan provides you a easy to use UI to manage your kubernetes
          clusters
        </p>
        <a class="button1" href="/login">Start Using KuberScan</a>

        <div class="mockup-container fade-in-up">
          <div class="feature-card pink">
            <div class="app-mockup">
              <div class="mockup-screen">
                <div class="terminal-output">
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Initializing pods... <br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Loading kubeconfig...<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Detecting version...<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Scanning nodes...<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Checking system pods...<br />
                  <span style="visibility:hidden">
                    _________________
                  </span>kube-dns-6f4fd4bdf | Running | 36734<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Inspecting traffic...<br />
                  <span style="visibility:hidden">_________________</span>No
                  anomal traffic detected.<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Possible crypto-miner detected<br />
                  <span style="visibility:hidden">_________________</span>Pod :
                  batch-worker-77fd6bbf9c<br />
                  <span style="visibility:hidden">
                    _________________
                  </span>Namespace : default<br />
                  <span style="visibility:hidden">_________________</span>CPU
                  usage : 92% average during 12658 seconds<br />
                  <span style="color:white">kuberscan@root:~$</span>{" "}
                  Sending alert and quarantine pod...<br />
                  <span style="visibility:hidden">_________________</span>Risk
                  72%<br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <h2 class="section-title">How it works</h2>
        <div class="features-grid">
          <div class="feature-item">
            <h3>Deploy Kubernetes</h3>
            <p>
              Be sure you have falco configured to send alerts and just deploy
              your clusters
            </p>
          </div>
          <div class="feature-item">
            <h3>Start using your clusters/pods</h3>
            <p>
              Just enjoy your development, KuberScan will notice you if it
              detects anomalys
            </p>
          </div>
          <div class="feature-item">
            <h3>Real Time protection</h3>
            <p>
              If KuberScan sees anormal behaviour will auto-quarantine the pod
              for security
            </p>
          </div>
        </div>
      </section>

      <section id="about">
        <h2 class="section-title">How it was created?</h2>
        <p class="section-subtitle">
          KuberScan combines static and dynamic scans
        </p>

        <div class="two-column">
          <div class="content-block">
            <h2>Make deployment secure</h2>
            <p>
              In such a advanced tecnlogy era we need to be really carefull
              about what we do on internet
            </p>
            <ul>
              <li>Prevent CVEs</li>
              <li>Real-Time detection</li>
              <li>User Panel</li>
              <li>Auto-quarantine decisions</li>
            </ul>
          </div>
          <img
            class="cveimagen"
            src="https://i.ibb.co/ycr9FVLk/CVE-2.png"
            alt="CVE"
          />
        </div>
      </section>

      <section>
        <h2 class="section-title">Connect to your own webhooks</h2>
        <div class="stats-container">
          <div style="margin:20px">
            <img
              class="logo-icon2"
              src="https://img.freepik.com/free-psd/3d-rendering-social-media-icon_23-2151413525.jpg"
            />
          </div>
          <div style="margin:20px">
            <img
              class="logo-icon2"
              src="https://img.freepik.com/free-psd/3d-rendering-social-media-icon_23-2151413511.jpg"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 class="section-title">Our Testimonials</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-rating">★★★★★</div>
            <p class="testimonial-text">
              "KuberScan has transformed how we manage our Kubernetes clusters.
              The real-time alerts and auto-quarantine features are lifesavers!"
            </p>
            <div class="author-info">
              <h4>Sarah Johnson</h4>
              <p>Londos, UK</p>
            </div>
          </div>
          <div class="testimonial-card">
          <div class="testimonial-rating">★★★★★</div>
          <p class="testimonial-text">
            "KuberScan's intuitive interface and powerful features have made
            managing our clusters effortless."
          </p>
          <div class="testimonial-author">
            <div class="author-info">
              <h4>Jorge Vazquez</h4>
              <p>Galicia, España</p>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-rating">★★★★★</div>
          <p class="testimonial-text">
            "The best Kubernetes security tool I've ever used. It's saved us
            countless hours of manual monitoring."
          </p>
          <div class="testimonial-author">
            <div class="author-info">
              <h4>Alvaro Perez</h4>
              <p>Madrid, España</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section style="text-align: center; padding: 120px 5%;">
        <h2 class="section-title">Ready to start?</h2>
        <a href="/login" class="button1">Login</a>
      </section>
    </>
  );
};

export default Index;
