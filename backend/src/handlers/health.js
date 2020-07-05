async function ping(event, context) {
  const now = new Date();

  const resp = {
    status: "Healthy",
    timestamp: now,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
}

export const handler = ping;
