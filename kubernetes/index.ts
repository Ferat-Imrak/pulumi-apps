import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
// import * as eks from "@pulumi/eks";
import * as kubernetes from "@pulumi/kubernetes";
import * as k8s from "@pulumi/kubernetes";
import * as eks from "@pulumi/eks";

const appName = "nginx-cluster-tst"
const repository = new awsx.ecr.Repository("nginx-cluster-tst", {});
const image = new awsx.ecr.Image("image", {
    repositoryUrl: repository.url,
    path: "./app/",
});

// const kubeconfigPath = "~/.kube/config"; // Path to your local kubeconfig file.

// const clusterProvider = new k8s.Provider("cluster-provider", {
//     kubeconfig: pulumi.output(kubeconfigPath).apply(path => {
//         // Resolve the tilde (~) to the user's home directory.
//         return path.replace(/^~($|\/|\\)/, `${require("os").homedir()}$1`);
//     }),
// });

const namespace = new k8s.core.v1.Namespace("nginx-testing", {
    metadata: {
        name: "nginx-testing"
    }
}); 

const nginxDeployment = new k8s.apps.v1.Deployment("nginx-deployment", {
    metadata: {
        namespace: namespace.metadata.name, 
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: {
                app: "nginx-app",
            },
        },
        template: {
            metadata: {
                labels: {
                    app: "nginx-app",
                },
            },
            spec: {
                containers: [
                    {
                        name: "my-container",
                        image: pulumi.interpolate`${repository.url}:latest`,
                        resources: {
                            requests: {
                                cpu: "100m",
                                memory: "128Mi",
                            },
                            limits: {
                                cpu: "500m",
                                memory: "256Mi",
                            },
                        },
                    },
                ],
            },
        },
    },
});

export const url = repository.url;