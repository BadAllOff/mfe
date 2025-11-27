# Microfrontend App - Financial Platform

Access via https://d30l8vjkicldr6.cloudfront.net/
This repository contains a microfrontend application structured into multiple packages. Each package represents a different part of the application, such as authentication, container, dashboard, and marketing.

# Description

Created blueprints and templates/examples and proposed build and deployment strategies that could be used as the micro frontend solution in the described project.

As a result we should be able to run this project with at least two empty micro frontends locally, and also to be able to explain how it is expected to be built and deployed during feature releases.

It is recommended to leverage the ***Webpack Module Federation*** or monorepo with NiX.

Task

You need to create micro frontends for the web application from Case 2, but with some easing in requirements: we need to deliver only the website (without delivering for Android and Apple platforms), we do not need to integrate a legacy system into ours with iframe.

Our main goal is to provide users with continuous experience during switching the micro frontends. You may consider using single-spa and webpack module federation.

It will be a huge plus if you provide your project with a proposal about versioned releases with ability to revert / release particular versions of the micro frontend.

No implementation of CI/CD is required, just a clear explanation.

Create a repository with blueprints and share the link with the professor.

## Project Structure

- **auth**: Handles authentication-related functionalities.
- **container**: The main application container that integrates other microfrontends.
- **dashboard**: Provides dashboard functionalities.
- **marketing**: Contains marketing-related components and pages.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**
   ```bash
   cd microfrontendApp/mfp
   ```

3. **Install dependencies for each package**
   ```bash
   cd packages/container
   npm install
   ```
   Repeat for other packages as needed.

4. **Run the application**
   ```bash
   npm start
   ```
   This will start the development server.

## Deployment

The application is set up to deploy using GitHub Actions. Ensure that all necessary secrets are configured in the repository settings.

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.



# Elaboration on Deployment and Rollback Proposal for Capstone Project Micro Frontend

## Introduction
In the capstone project's micro frontend (MF) architecture using Webpack Module Federation and single-spa, deployments and rollbacks are designed to support independent team workflows while ensuring continuous user experience (UX) and minimal downtime. Each MF (e.g., marketing, dashboard) is deployed as static assets to a CDN (e.g., AWS S3 with CloudFront), allowing for versioned uploads. The shell app acts as the orchestrator, using a configurable remotes.json to point to specific MF versions.

This elaboration builds on the initial blueprint:
- **Versioning**: Semantic Versioning (SemVer) per repo (e.g., `npm version patch` to bump to v1.0.1).
- **Deployment**: Upload to versioned S3 paths (e.g., s3://bucket/investor-tools/v1.0.1/remoteEntry.js).
- **Shell Config**: remotes.json pins URLs (e.g., `{ "dashboard": "https://d30l8vjkicldr6.cloudfront.net/dashboard/v1.0.1/remoteEntry.js" }`).
- **Revert/Rollback**: Update remotes.json to an older version and redeploy the shell.
- **Release**: Teams deploy MFs independently; shell team updates pins after review.

We'll use a **blue-green deployment strategy** as the primary approach for zero-downtime releases, supplemented by canary elements for testing. This is inspired by best practices from AWS guidance on MF with Module Federation, where blue-green minimizes impact and enables quick rollbacks, and version-based canaries (e.g., via user hashing) catch issues early. Feature flags can enhance for finer control.

## Chosen Deployment Strategy: Blue-Green with Canary Testing
### Why Blue-Green?
- **Zero-Downtime**: In blue-green, you maintain two identical "environments" (in our case, versioned paths on CDN): "blue" (current live version) and "green" (new version). Traffic switches atomically by updating the shell's config, avoiding interruptions—critical for the financial platform's high-priority UX.
- **Simplicity for Static Assets**: Since MFs are static bundles (no servers), blue-green fits perfectly: Deploy green to a new path, validate, then switch. No need for complex orchestration like Kubernetes.
- **Quick Rollback**: If issues arise post-switch, revert by pointing back to blue.
- **Alignment with MF**: Supports independent deploys; teams release greens without affecting live traffic until shell switches.

Alternatives considered:
- **Pure Canary**: Gradual rollout to user subsets (e.g., 10% get new version). Useful for monitoring, but adds complexity in the shell (e.g., user hashing). We'll incorporate it as a pre-switch testing phase.
- **Feature Flags**: Toggle new features within an MF (e.g., via LaunchDarkly). Good for A/B testing but overkill if not needed initially - can add later.
- **Rolling Updates**: Not ideal for static MF, as it requires server-side routing.

Blue-green is recommended for our setup per AWS MF patterns and real-world examples (like my current project on client side tha I'm working on), enabling 3x more frequent deploys with reduced risk.

### Implementation of Deployment
#### Step-by-Step Flow

1. **MF Team Prepares Release**:
   - Develop/test in feature branch.
   - Bump version: `npm version minor` (e.g., to v2.0.0).
   - Build: `npm run build` → Outputs dist/ with remoteEntry.js.
   - Upload to versioned S3 path: Use CI/CD (e.g., GitHub Actions script)
   - Notify shell team (e.g., via Slack webhook) for review.

2. **Validation (Health Checks)**:
   - **Manual/Automated Checks**: Deploy to staging env (temp S3 path). Run e2e tests (e.g., Cypress) to verify:
     - Availability: Can remoteEntry.js load?
     - Integration: Does it compose in shell without errors?
     - Performance: Load time < threshold.
     - Business Logic: Placeholder flows work (expand for real instruments).

3. **Canary Testing (Optional Pre-Switch)**:
   - In shell, temporarily route a subset of users to green via user hashing.
   - Monitor for 10-30 mins (metrics: error rates, user feedback). If issues, auto-rollback by disabling canary flag.

4. **Switch Traffic (Blue-Green Cutover)**:
   - Shell team updates remotes.json.
   - Redeploy shell: Similar GitHub Actions workflow uploads shell bundle to S3 root.
   - Atomic switch: CDN invalidation ensures quick propagation (CloudFront ~5-15 mins).

5. **Post-Deployment Monitoring**:
   - Watch metrics (e.g., via Datadog/Grafana). If anomalies, initiate rollback.

#### Tools and Infra
- **CI/CD**: GitHub Actions per repo for independent builds/deploys.
- **CDN**: AWS S3/CloudFront for caching; versioned paths prevent cache issues.
- **Feature Flags**: Optional integration (e.g., ConfigCat, ReHub) for canary toggles.

## Implementation of Rollback
### Why Integrated with Blue-Green?
Rollback is seamless in blue-green: Old (blue) assets remain on CDN, so switching back is just a config change—no redeploy of MFs.

### Step-by-Step Flow
1. **Detect Issue**: Via monitoring (e.g., error spike >5%) or user reports.
2. **Initiate Rollback**:
   - Update remotes.json to old version:
     ```json
     {
       "dashboard": "https://d30l8vjkicldr6.cloudfront.net/dashboard/v1.0.0/remoteEntry.js"
     }
     ```
   - Redeploy shell (quick, as it's static).
   - For canary-only issues: Toggle flag off without full switch.

3. **Automated Rollback**:
   - Enhance CI/CD: If health checks fail post-switch, script auto-reverts remotes.json and redeploys.

4. **Targeted Rollback**:
   - If only affecting subset (e.g., via canary data), revert only for those users

### Benefits and Risks
- **Benefits**: Instant (CDN switch time); isolated (per MF); no data loss.
- **Risks**: Config errors—mitigate with automated tests on remotes.json. Cache staleness—use invalidations.

This strategy ensures fast, safe releases aligning with the client's needs for rapid feature delivery and high UX. For production, start with manual switches, automate gradually.