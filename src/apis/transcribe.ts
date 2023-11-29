const ip = "192.168.0.41";

export const test = {
  send: async () => {
    const response = await fetch(`http://${ip}:8000/test`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Response:", responseData);
    } else {
      console.log("Error:", response.status);
    }
  },
};

export const transcribe = async (request: { formData: FormData }) => {
  const response = fetch(`http://${ip}:8000/api/openai/transcribe`, {
    method: "POST",
    body: request.formData,
  });
  return (await response).text();
};
