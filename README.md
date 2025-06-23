# Cost-Model-Tool

## ðŸš€ Build & Run

\\\ash
docker build -t cost-model-app .
docker run -p 8000:8000 \\
  -e AWS_ACCESS_KEY_ID=... \\
  -e AWS_SECRET_ACCESS_KEY=... \\
  cost-model-app
\\\

Then open [http://localhost:8000](http://localhost:8000).

## ðŸ§© Extending

- Add additional service endpoints in \pricing.py\ + FastAPI.
- Set up CI/CD, deploy to ECS, AWS Lambda, or Heroku.
