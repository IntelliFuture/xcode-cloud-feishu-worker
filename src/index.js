async function sendFeishuMessage(webhookUrl, json) {
	const res = await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			msg_type: "post",
			content: {
				post: {
					zh_cn: {
						title: "🚀 构建" + "[" + json['metadata']['attributes']['eventType'] + "]:" + json['ciProduct']['attributes']['name'],
						content: [
							[
								{ tag: "text", text: '📦 Build 版本:' + json['ciBuildRun']['attributes']['number'] }
							],
							[
								{
									tag: "text", text: "👤 提交者:" + json['ciBuildRun']['attributes']['sourceCommit']['author']['displayName']
								}
							],
							[
								{ tag: "a", text: "🔍 查看Commit详情", href: json['ciBuildRun']['attributes']['sourceCommit']['htmlUrl'] }
							]
						]
					}
				}
			}
		})
	});

	const data = await res.json();
	console.log(data);
}

export default {

	async fetch(request, env, ctx) {
		// 获取请求方法
		try {
			const contentType = request.headers.get("content-type") || "";

			if (contentType.includes("application/json")) {
				const json = await request.json();
				await sendFeishuMessage(env.FEISHU_HOST, json);
			}

			return new Response(`Received Payload:\n\n`, {
				status: 200,
				headers: { "Content-Type": "text/plain" },
			});
		} catch (err) {
			return new Response(`Error reading payload: ${err.message}`, { status: 400 });
		}
	},
};
