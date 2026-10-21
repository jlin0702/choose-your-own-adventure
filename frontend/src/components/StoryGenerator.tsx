import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {api} from "../api/client";
import {ThemeInput} from "./ThemeInput";
import {LoadingStatus} from "./LoadingStatus";

export function StoryGenerator() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("");
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let pollInterval: number | undefined;

        if (jobId && jobStatus === 'processing') {
            pollInterval = setInterval(() => {
                void pollJobStatus(jobId);
            }, 5000);
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        }
    }, [jobId, jobStatus])
    async function generateStory(theme: string) {
        setLoading(true);
        setError('');
        setTheme(theme);

        const {data, error} = await api.POST('/story/create', {
            body: {
                theme,
            }
        });

        if (error) {
            setError('Failed to generate story');
            return;
        }

        const {job_id, status} = data;
        setJobId(job_id);
        setJobStatus(status);
        await pollJobStatus(job_id);
    }
    async function pollJobStatus(id: string) {
        const {data, error} = await api.GET(
            '/job/{job_id}',
            {
                params: {
                    path: { job_id: id}
                }
            }
        );

        if (error) {
            setError("Failed to check story status");
            setLoading(false);
            return;
        }
        const { status, story_id, error: jobError } = data;
        setJobStatus(status);

        if (status === 'completed' && story_id) {
            await fetchStory(story_id);
        } else if (status === 'failed' || jobError) {
            setError(jobError || 'Failed to generate story');
            setLoading(false);
        }
    }

    async function fetchStory(id: number) {
        try {
            setLoading(false);
            setJobStatus('completed');
            navigate(`/story/${id}`);
        } catch (e) {
            setError('Failed to load story.');
            setLoading(false);
            console.error(e);
        }
    }

    const reset = () => {
        setJobId(null);
        setJobStatus(null);
        setError("");
        setTheme("");
        setLoading(false);
    };

    return <div className="story-generator">
        {error && <div className="error-message">
            <p>{error}</p>
            <button onClick={reset}>Try Again</button>
        </div>}

        {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory}/>}

        {loading && <LoadingStatus theme={theme}/>}
    </div>
}