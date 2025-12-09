import type {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	CreateAxiosDefaults,
} from "axios";
import axios from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

type Options = CreateAxiosDefaults & {
	retries?: number;
	retryErrorCodes?: number[];
};

@injectable()
export class HttpClient {
	private readonly instance: AxiosInstance;
	private readonly options: Options | undefined;

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		options?: Options,
	) {
		this.options = options;
		this.instance = axios.create({
			baseURL: options?.baseURL,
			timeout: options?.timeout ?? 10_000,
			headers: options?.headers,
		});

		axiosRetry(this.instance, {
			retries: options?.retries ?? 3,
			retryDelay: axiosRetry.exponentialDelay,
			retryCondition: (error) => {
				// rede ou métodos idempotentes (GET, HEAD, OPTIONS, PUT, DELETE)
				if (isNetworkOrIdempotentRequestError(error)) return true;

				// ou se você quiser repetir 5xx / 429
				const status = (error as AxiosError)?.response?.status;
				if (!status) return false;

				const codes = this.options?.retryErrorCodes ?? [
					429, 500, 502, 503, 504,
				];

				return codes.includes(status);
			},
		});

		this.instance.interceptors.request.use((config) => {
			this.logger.info(`[HttpClient]: Request ${config.baseURL}${config.url}`, {
				config,
			});
			return config;
		});

		this.instance.interceptors.response.use(
			(response) => {
				this.logger.info(
					`[HttpClient]: Response ${response.config.baseURL}${response.config.url}`,
				);
				return response;
			},
			(error: AxiosError) => {
				this.logger.error(`[HttpClient]: Request failed: ${error.message}`, {
					baseURL: this.options?.baseURL,
					url: error.config?.url,
				});
				return Promise.reject(error);
			},
		);
	}

	get<T = unknown>(url: string, config?: AxiosRequestConfig) {
		return this.instance.get<T>(url, config);
	}

	post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.instance.post<T>(url, data, config);
	}
}
